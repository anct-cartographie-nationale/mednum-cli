import axios, { AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { authHeader, headers, paginate } from '../../../../common';
import { MergeGroupTransfer } from '../../../data';
import { findGroupIdsToDelete, Groups, MergedLieuxByGroupMap, MergeGroup, mergeGroups } from '../../../steps';
import { DedupliquerOptions } from '../../dedupliquer-options';

axiosRetry(axios, { retries: 3 });

const toSourceFromId = (id: string): string | undefined => id.split('_')[0];

export const shouldMarkAsDeduplicated = (mergeGroupsMap: Map<string, string[]>): boolean =>
  Array.from(new Set(Array.from(mergeGroupsMap.values()).flat().map(toSourceFromId))).length > 1;

const nothingToUpdate = (groups: Groups, merged: MergedLieuxByGroupMap): boolean =>
  merged.size === 0 && groups.itemGroupMap.size === 0 && groups.mergeGroupsMap.size === 0;

export const saveWithApi =
  (dedupliquerOptions: DedupliquerOptions) =>
  async (groups: Groups, merged: MergedLieuxByGroupMap): Promise<void> => {
    if (nothingToUpdate(groups, merged)) {
      console.log("Il n'y a rien à mettre à jour");
      return;
    }

    try {
      console.log('Recupération des groupes à supprimer');

      const groupsToDelete: string[] = findGroupIdsToDelete(
        await paginate<MergeGroup>(
          `${dedupliquerOptions.cartographieNationaleApiUrl}/lieux-inclusion-numerique/merge-groups?page[number]=0&page[size]=2000`
        )
      )(groups);

      const groupsToDeleteBatchSize: number = 200;
      const numberOfGroupsToDeleteBatches: number = Math.ceil(groupsToDelete.length / groupsToDeleteBatchSize);

      console.log(`Il y a ${groupsToDelete.length} groupes à supprimer répartis sur ${numberOfGroupsToDeleteBatches} lots`);

      for (let i: number = 0; i < numberOfGroupsToDeleteBatches; i++) {
        console.log(`Suppression du lot ${i + 1}/${numberOfGroupsToDeleteBatches}`);
        await axios.patch<unknown, AxiosResponse, MergeGroupTransfer>(
          `${dedupliquerOptions.cartographieNationaleApiUrl}/lieux-inclusion-numerique/merge-groups`,
          {
            mergeGroups: [],
            groupIdsToDelete: groupsToDelete.slice(i * groupsToDeleteBatchSize, (i + 1) * groupsToDeleteBatchSize)
          },
          headers(authHeader(dedupliquerOptions.cartographieNationaleApiKey))
        );
      }

      const mergeGroupsToSave: MergeGroup[] = mergeGroups(groups, merged);
      const mergeGroupsBatchSize: number = 1000;
      const numberOfMergeGroupsToSaveBatches: number = Math.ceil(mergeGroupsToSave.length / mergeGroupsBatchSize);

      console.log(
        `Il y a ${mergeGroupsToSave.length} groupes à enregistrer répartis sur ${numberOfMergeGroupsToSaveBatches} lots`
      );

      for (let i: number = 0; i < numberOfMergeGroupsToSaveBatches; i++) {
        console.log(`Enregistrement du lot ${i + 1}/${numberOfMergeGroupsToSaveBatches}`);
        await axios.patch<unknown, AxiosResponse, MergeGroupTransfer>(
          `${dedupliquerOptions.cartographieNationaleApiUrl}/lieux-inclusion-numerique/merge-groups`,
          {
            mergeGroups: mergeGroupsToSave.slice(i * mergeGroupsBatchSize, (i + 1) * mergeGroupsBatchSize),
            groupIdsToDelete: []
          },
          headers(authHeader(dedupliquerOptions.cartographieNationaleApiKey))
        );
      }

      console.log('Marquage des lieux comme dédupliqués');

      if (shouldMarkAsDeduplicated(groups.mergeGroupsMap)) {
        await axios.patch<unknown, AxiosResponse>(
          `${dedupliquerOptions.cartographieNationaleApiUrl}/lieux-inclusion-numerique/mark-all-as-deduplicated`,
          null,
          headers(authHeader(dedupliquerOptions.cartographieNationaleApiKey))
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
