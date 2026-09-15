import type { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { inject, injectOr } from '../../../../libraries/injection/index';
import { type Journal, JOURNAL, silentJournal } from '../../../../libraries/journal/index';
import {
  appendCoopId,
  describeOversizedId,
  type DuplicationComparison,
  duplicationComparisons,
  type FilteredMergedLieux,
  filterOversizedIds,
  type Groups,
  groupDuplicates,
  type MergedLieuxByGroupMap,
  mergeDuplicates,
  overDuplicationScoreThreshold,
  withoutObsoleteLabels
} from '../../domain/index';
import { IS_INCLUDED, LOAD_LIEUX, SAVE_DEDUPLICATION } from '../../keys/index';

export type DedupliquerDesLieux = {
  source: string;
  baseSource: string;
  allowInternal: boolean;
};

const loadLieux = async (source: string): Promise<SchemaLieuMediationNumerique[]> =>
  (await inject(LOAD_LIEUX)(source)).map(withoutObsoleteLabels);

const reportOversizedIds = (journal: Journal, oversizedIds: string[]): void => {
  if (oversizedIds.length === 0) return;
  journal.info(`- lieux exclus car id trop long : ${oversizedIds.length}`);
  for (const id of oversizedIds) {
    journal.info(describeOversizedId(id));
  }
};

export const dedupliquerDesLieux = async ({ source, baseSource, allowInternal }: DedupliquerDesLieux): Promise<void> => {
  const journal: Journal = injectOr(JOURNAL, silentJournal);

  journal.info('1. chargement des données');
  const lieuxToDeduplicate: SchemaLieuMediationNumerique[] = await loadLieux(baseSource);
  const lieuxMediationNumerique: SchemaLieuMediationNumerique[] = await loadLieux(source);

  journal.info(`2. recherche des doublons parmi les ${lieuxToDeduplicate.length} lieux`);
  const duplications: DuplicationComparison[] = duplicationComparisons(
    lieuxToDeduplicate,
    allowInternal,
    lieuxMediationNumerique
  );

  const filteredDuplications: DuplicationComparison[] = duplications.filter(overDuplicationScoreThreshold(allowInternal));

  journal.info(`3. groupement des doublons selon les ${filteredDuplications.length} groupes identifiés`);
  const groups: Groups = groupDuplicates(filteredDuplications);

  journal.info('4. fusion des doublons');
  const merged: MergedLieuxByGroupMap = mergeDuplicates(new Date())(lieuxToDeduplicate, groups);
  journal.info(`- lieux concernés par une fusion : ${groups.itemGroupMap.size}`);
  journal.info(`- lieux fusionnés à enregistrer : ${merged.size}`);

  const filtered: FilteredMergedLieux = filterOversizedIds(merged);
  reportOversizedIds(journal, filtered.oversizedIds);

  journal.info("5. ajout de l'identifiant de de référence de la coop de la médiation numérique");
  const lieuxToDeduplicateWithCoopId: SchemaLieuMediationNumerique[] = lieuxToDeduplicate.map(appendCoopId);

  journal.info('6. exclusion des lieux selon les critères définis');
  const lieuxWithoutExcluded: SchemaLieuMediationNumerique[] = lieuxToDeduplicateWithCoopId.filter(inject(IS_INCLUDED));

  journal.info('7. sauvegarde des données dédupliquées');
  await inject(SAVE_DEDUPLICATION)(groups, filtered.merged, lieuxWithoutExcluded, duplications);
};
