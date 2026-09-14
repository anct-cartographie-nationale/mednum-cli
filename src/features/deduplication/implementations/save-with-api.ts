import type { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import {
  fetchMergeGroups,
  markAllAsDeduplicated,
  type MergeGroupTransfer,
  patchMergeGroups
} from '../../../libraries/cartographie-nationale-api';
import type { Api } from '../../../libraries/http';
import { injectOr } from '../../../libraries/injection';
import { type Journal, JOURNAL, silentJournal } from '../../../libraries/journal';
import {
  findGroupIdsToDelete,
  type Groups,
  type MergedLieuxByGroupMap,
  type MergeGroup,
  mergeGroups,
  type SaveDeduplication
} from '../domain';

const GROUPS_TO_DELETE_BATCH_SIZE = 200;
const MERGE_GROUPS_BATCH_SIZE = 1000;

const toSourceFromId = (id: string): string | undefined => id.split('_')[0];

export const shouldMarkAsDeduplicated = (mergeGroupsMap: Map<string, string[]>): boolean =>
  Array.from(new Set(Array.from(mergeGroupsMap.values()).flat().map(toSourceFromId))).length > 1;

const nothingToUpdate = (groups: Groups, merged: MergedLieuxByGroupMap): boolean =>
  merged.size === 0 && groups.itemGroupMap.size === 0 && groups.mergeGroupsMap.size === 0;

const batchesOf = <T>(items: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(items.length / size) }, (_: unknown, index: number): T[] =>
    items.slice(index * size, (index + 1) * size)
  );

const deleteGroups = async (api: Api, journal: Journal, groupIdsToDelete: string[]): Promise<void> => {
  const batches: string[][] = batchesOf(groupIdsToDelete, GROUPS_TO_DELETE_BATCH_SIZE);
  journal.info(`Il y a ${groupIdsToDelete.length} groupes à supprimer répartis sur ${batches.length} lots`);

  for (const [index, batch] of batches.entries()) {
    journal.info(`Suppression du lot ${index + 1}/${batches.length}`);
    await patchMergeGroups<SchemaLieuMediationNumerique>(api, { mergeGroups: [], groupIdsToDelete: batch });
  }
};

const saveGroups = async (api: Api, journal: Journal, mergeGroupsToSave: MergeGroup[]): Promise<void> => {
  const batches: MergeGroup[][] = batchesOf(mergeGroupsToSave, MERGE_GROUPS_BATCH_SIZE);
  journal.info(`Il y a ${mergeGroupsToSave.length} groupes à enregistrer répartis sur ${batches.length} lots`);

  for (const [index, batch] of batches.entries()) {
    journal.info(`Enregistrement du lot ${index + 1}/${batches.length}`);
    await patchMergeGroups<SchemaLieuMediationNumerique>(api, { mergeGroups: batch, groupIdsToDelete: [] });
  }
};

export const saveWithApi =
  (api: Api): SaveDeduplication =>
  async (groups: Groups, merged: MergedLieuxByGroupMap): Promise<void> => {
    const journal: Journal = injectOr(JOURNAL, silentJournal);

    if (nothingToUpdate(groups, merged)) {
      journal.info("Il n'y a rien à mettre à jour");
      return;
    }

    journal.info('Recupération des groupes à supprimer');
    const existingGroups: MergeGroupTransfer<SchemaLieuMediationNumerique>[] =
      await fetchMergeGroups<SchemaLieuMediationNumerique>(api);

    await deleteGroups(api, journal, findGroupIdsToDelete(existingGroups)(groups));
    await saveGroups(api, journal, mergeGroups(groups, merged));

    journal.info('Marquage des lieux comme dédupliqués');
    if (shouldMarkAsDeduplicated(groups.mergeGroupsMap)) await markAllAsDeduplicated(api);
  };
