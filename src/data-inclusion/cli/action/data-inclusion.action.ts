/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import * as fs from 'fs';
import axios, { AxiosResponse } from 'axios';
import { SchemaServiceDataInclusion, SchemaStructureDataInclusion } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Api, bearerTokenHeader } from '../../../common';
import { DataInclusionMerged } from '../../data-inclusion-merged';
import { structuresWithServicesNumeriques } from '../../merge-services-in-structure';
import { DataInclusionOptions } from '../data-inclusion-options';

const onlyMatchingSource =
  (source?: string) =>
  (item: DataInclusionMerged): boolean =>
    source == null ? true : item.source === source;

const filePayload =
  (filter: string) =>
  (dataInclusionStructures: SchemaStructureDataInclusion[], dataInclusionServices: SchemaServiceDataInclusion[]): string =>
    JSON.stringify(
      structuresWithServicesNumeriques(dataInclusionStructures, dataInclusionServices).filter(onlyMatchingSource(filter))
    );

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

export const dataInclusionAction = async (dataInclusionOptions: DataInclusionOptions): Promise<void> => {
  const responseStructures: SchemaStructureDataInclusion[] = await fetchFromDataInclusionApi({
    key: dataInclusionOptions.dataInclusionApiKey,
    url: 'https://api.data.inclusion.beta.gouv.fr/api/v0/structures?sources=dora'
  });

  const responseServices: SchemaServiceDataInclusion[] = await fetchFromDataInclusionApi({
    key: dataInclusionOptions.dataInclusionApiKey,
    url: 'https://api.data.inclusion.beta.gouv.fr/api/v0/services?sources=dora'
  });

  fs.writeFileSync(
    dataInclusionOptions.outputFile,
    filePayload(dataInclusionOptions.filter)(responseStructures, responseServices),
    'utf8'
  );
};
