import axios, { type AxiosResponse } from 'axios';
import type { SchemaServiceDataInclusion, SchemaStructureDataInclusion } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { type Api, bearerTokenHeader } from '../http/index.js';

const DATA_INCLUSION_API_URL = 'https://api.data.inclusion.beta.gouv.fr/api/v1';

const fetchAllPages = async <T>(
  { key, url }: Api,
  totalPages: number,
  currentPage: number = 2,
  allPagesDatas: T[] = []
): Promise<T[]> => {
  if (currentPage > totalPages) return allPagesDatas;

  const response: AxiosResponse = await axios.get(`${url}&page=${currentPage}`, bearerTokenHeader(key));

  return fetchAllPages({ key, url }, totalPages, currentPage + 1, [...allPagesDatas, ...response.data.items]);
};

const fetchFromDataInclusionApi = async <T>({ key, url }: Api): Promise<T[]> => {
  const { items, pages }: { items: T[]; pages: number } = (await axios.get(`${url}&page=1`, bearerTokenHeader(key))).data;
  return [...items, ...(await fetchAllPages<T>({ key, url }, pages))];
};

export const structuresFromDataInclusionApi = async (
  apiKey: string,
  sources: string
): Promise<SchemaStructureDataInclusion[]> =>
  fetchFromDataInclusionApi({ key: apiKey, url: `${DATA_INCLUSION_API_URL}/structures?sources=${sources}` });

export const servicesFromDataInclusionApi = async (apiKey: string, sources: string): Promise<SchemaServiceDataInclusion[]> =>
  fetchFromDataInclusionApi({ key: apiKey, url: `${DATA_INCLUSION_API_URL}/services?sources=${sources}` });
