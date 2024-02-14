/* eslint-disable max-lines-per-function, max-statements, no-await-in-loop */

import axios, { AxiosResponse } from 'axios';
import { authHeader, headers, paginate } from '../../../../common';
import { MergeGroupTransfer } from '../../../data';
import { findGroupIdsToDelete, Groups, MergedLieuxByGroupMap, MergeGroup, mergeGroups } from '../../../steps';
import { DedupliquerOptions } from '../../dedupliquer-options';

const toSourceFromId = (id: string): string | undefined => id.split('_').at(0);

export const shouldMarkAsDeduplicated = (mergeGroupsMap: Map<string, string[]>): boolean =>
  Array.from(new Set(Array.from(mergeGroupsMap.values()).flat().map(toSourceFromId))).length > 1;

const nothingToUpdate = (groups: Groups, merged: MergedLieuxByGroupMap): boolean =>
  merged.size === 0 && groups.itemGroupMap.size === 0 && groups.mergeGroupsMap.size === 0;

export const saveWithApi =
  (dedupliquerOptions: DedupliquerOptions) =>
  async (groups: Groups, merged: MergedLieuxByGroupMap): Promise<void> => {
    if (nothingToUpdate(groups, merged)) return;

    try {
      const mergeGroupsToSave: MergeGroup[] = mergeGroups(groups, merged);
      const mergeGroupsBatchSize: number = 1000;
      const numberOfMergeGroupsToSaveBatches: number = Math.ceil(mergeGroupsToSave.length / mergeGroupsBatchSize);

      for (let i: number = 0; i < numberOfMergeGroupsToSaveBatches; i++) {
        await axios.patch<unknown, AxiosResponse, MergeGroupTransfer>(
          `${dedupliquerOptions.cartographieNationaleApiUrl}/lieux-inclusion-numerique/merge-groups`,
          {
            mergeGroups: mergeGroupsToSave.slice(i * mergeGroupsBatchSize, (i + 1) * mergeGroupsBatchSize),
            groupIdsToDelete: []
          },
          headers(authHeader(dedupliquerOptions.cartographieNationaleApiKey))
        );
      }

      const groupsToDelete: string[] = findGroupIdsToDelete(
        await paginate<MergeGroup>(
          `${dedupliquerOptions.cartographieNationaleApiUrl}/lieux-inclusion-numerique/merge-groups?page[number]=0&page[size]=2000`
        )
      )(groups);

      const groupsToDeleteBatchSize: number = 200;
      const numberOfGroupsToDeleteBatches: number = Math.ceil(groupsToDelete.length / groupsToDeleteBatchSize);

      for (let i: number = 0; i < numberOfGroupsToDeleteBatches; i++) {
        await axios.patch<unknown, AxiosResponse, MergeGroupTransfer>(
          `${dedupliquerOptions.cartographieNationaleApiUrl}/lieux-inclusion-numerique/merge-groups`,
          {
            mergeGroups: [],
            groupIdsToDelete: groupsToDelete.slice(i * groupsToDeleteBatchSize, (i + 1) * groupsToDeleteBatchSize)
          },
          headers(authHeader(dedupliquerOptions.cartographieNationaleApiKey))
        );
      }

      await axios.patch<unknown, AxiosResponse>(
        `${dedupliquerOptions.cartographieNationaleApiUrl}/lieux-inclusion-numerique/mark-all-as-deduplicated`,
        null,
        headers(authHeader(dedupliquerOptions.cartographieNationaleApiKey))
      );
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.log(error);
    }
  };
