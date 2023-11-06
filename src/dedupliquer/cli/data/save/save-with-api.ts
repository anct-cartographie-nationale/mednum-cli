import axios, { AxiosResponse } from 'axios';
import { authHeader, headers } from '../../../../common';
import { MergeGroupTransfer, mergeGroupTransfers } from '../../../data';
import { DedupliquerOptions } from '../../dedupliquer-options';
import { Groups, MergedLieuxByGroupMap } from '../../../steps';

export const saveWithApi =
  (dedupliquerOptions: DedupliquerOptions) =>
  async (groups: Groups, merged: MergedLieuxByGroupMap): Promise<AxiosResponse<void>> => {
    return await axios.patch<unknown, AxiosResponse, MergeGroupTransfer[]>(
      `${dedupliquerOptions.cartographieNationaleApiUrl}/lieux-inclusion-numerique/merge-groups`,
      mergeGroupTransfers(groups, merged),
      headers(authHeader(dedupliquerOptions.cartographieNationaleApiKey))
    );
  };
