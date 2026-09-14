import axios, { type AxiosResponse } from 'axios';
import { type Api, authHeader, headers, paginate } from '../http/index.js';

const lieuxUrl = (api: Api): string => `${api.url}/lieux-inclusion-numerique`;

export type FingerprintTransfer = {
  sourceId: string;
  hash?: string;
};

export const fetchFingerprints = async (api: Api, sourceName: string): Promise<FingerprintTransfer[]> =>
  (await axios.get<FingerprintTransfer[]>(`${lieuxUrl(api)}/fingerprints/${sourceName}`)).data;

export const patchFingerprints = async (api: Api, sourceName: string, fingerprints: unknown[]): Promise<void> => {
  await axios.patch<unknown, AxiosResponse, unknown[]>(
    `${lieuxUrl(api)}/fingerprints/${sourceName}`,
    fingerprints,
    headers(authHeader(api.key))
  );
};

export const patchLieux = async <TLieu>(api: Api, lieux: TLieu[]): Promise<void> => {
  await axios.patch<unknown, AxiosResponse, TLieu[]>(lieuxUrl(api), lieux, headers(authHeader(api.key)));
};

export const fetchLieuxWithDuplicates = async <TLieu>(api: Api, query: string): Promise<TLieu[]> =>
  paginate<TLieu>(`${lieuxUrl(api)}/with-duplicates?page[number]=0&page[size]=10000`, query);

export type SourceTransfer = {
  name: string;
  hash: string;
};

export const fetchSources = async (api: Api): Promise<SourceTransfer[]> =>
  (await axios.get<SourceTransfer[]>(`${api.url}/sources`)).data;

export const putSourceHash = async (api: Api, sourceName: string, hash: string): Promise<void> => {
  await axios.put(`${api.url}/sources/${sourceName}`, { hash }, headers(authHeader(api.key)));
};
