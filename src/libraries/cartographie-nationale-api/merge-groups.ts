import axios, { type AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { type Api, authHeader, headers, paginate } from '../http';

axiosRetry(axios, { retries: 3 });

/**
 * Groupes de fusion tels que l'API de la cartographie nationale les expose. Le type du lieu
 * reste ouvert : seul l'appelant sait quel schéma il manipule.
 */
export type MergeGroupTransfer<TLieu> = {
  groupId: string;
  mergedIds: string[];
  lieu: TLieu;
};

export type MergeGroupsPatch<TLieu> = {
  mergeGroups: MergeGroupTransfer<TLieu>[];
  groupIdsToDelete: string[];
};

const mergeGroupsUrl = (api: Api): string => `${api.url}/lieux-inclusion-numerique/merge-groups`;

export const fetchMergeGroups = async <TLieu>(api: Api): Promise<MergeGroupTransfer<TLieu>[]> =>
  paginate<MergeGroupTransfer<TLieu>>(`${mergeGroupsUrl(api)}?page[number]=0&page[size]=2000`);

export const patchMergeGroups = async <TLieu>(api: Api, patch: MergeGroupsPatch<TLieu>): Promise<void> => {
  await axios.patch<unknown, AxiosResponse, MergeGroupsPatch<TLieu>>(mergeGroupsUrl(api), patch, headers(authHeader(api.key)));
};

export const markAllAsDeduplicated = async (api: Api): Promise<void> => {
  await axios.patch<unknown, AxiosResponse>(
    `${api.url}/lieux-inclusion-numerique/mark-all-as-deduplicated`,
    null,
    headers(authHeader(api.key))
  );
};
