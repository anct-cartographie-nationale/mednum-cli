import axios, { AxiosResponse } from 'axios';
import { authHeader, headers } from '../../../../common';
import { MergeGroupTransfer } from '../../../data';
import { findGroupIdsToDelete, Groups, MergedLieuxByGroupMap, MergeGroup, mergeGroups } from '../../../steps';
import { DedupliquerOptions } from '../../dedupliquer-options';

const toSourceFromId = (id: string): string | undefined => id.split('@').at(0);

export const shouldMarkAsDeduplicated = (mergeGroupsMap: Map<string, string[]>): boolean =>
  Array.from(new Set(Array.from(mergeGroupsMap.values()).flat().map(toSourceFromId))).length > 1;

export const saveWithApi =
  (dedupliquerOptions: DedupliquerOptions) =>
  async (groups: Groups, merged: MergedLieuxByGroupMap): Promise<AxiosResponse<void>> => {
    const previousMergeGroup: MergeGroup[] = (
      await axios.get<MergeGroup[]>(`${dedupliquerOptions.cartographieNationaleApiUrl}/lieux-inclusion-numerique/merge-groups`)
    ).data;

    return axios.patch<unknown, AxiosResponse, MergeGroupTransfer>(
      `${
        dedupliquerOptions.cartographieNationaleApiUrl
      }/lieux-inclusion-numerique/merge-groups?markAsDeduplicated=${shouldMarkAsDeduplicated(groups.mergeGroupsMap)}`,
      {
        mergeGroups: mergeGroups(groups, merged),
        groupIdsToDelete: findGroupIdsToDelete(previousMergeGroup)(groups)
      },
      headers(authHeader(dedupliquerOptions.cartographieNationaleApiKey))
    );
  };
