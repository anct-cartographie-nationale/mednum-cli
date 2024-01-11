import {
  SchemaServiceDataInclusion,
  SchemaStructureDataInclusion
} from '@gouvfr-anct/lieux-de-mediation-numerique/lib/cjs/transfer/schema-data-inclusion/schema-data-inclusion';
import axios, { AxiosResponse } from 'axios';
/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import * as fs from 'fs';
import { DataInclusionMerged } from '../../data-inclusion-merged';
import { structuresWithServicesNumeriques } from '../../merge-services-in-structure';
import { DataInclusionOptions } from '../data-inclusion-options';
import { Api } from '../../../common';

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

const getApiKey = (properties: DataInclusionOptions): Api => ({
  key: properties.dataInclusionApiKey
});

const fetchAllPages = async <T extends SchemaServiceDataInclusion | SchemaStructureDataInclusion>(
  apiUrl: string,
  dataInclusionOptions: DataInclusionOptions,
  totalPages: number,
  currentPage: number = 2,
  allPagesDatas: T[] = []
): Promise<T[]> => {
  if (currentPage > totalPages) {
    return allPagesDatas;
  }

  const response: AxiosResponse = await axios.get(`${apiUrl}&page=${currentPage}`, {
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    headers: { Authorization: `Bearer ${getApiKey(dataInclusionOptions).key}` }
  });
  allPagesDatas.push(...response.data.items);

  return fetchAllPages(apiUrl, dataInclusionOptions, totalPages, currentPage + 1, allPagesDatas);
};

const fetchDataInclusionStructures = async (
  dataInclusionOptions: DataInclusionOptions,
  dataInclusionStructureUrl: string
): Promise<SchemaStructureDataInclusion[]> =>
  axios
    .get(`${dataInclusionStructureUrl}&page=1`, {
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      headers: { Authorization: `Bearer ${getApiKey(dataInclusionOptions).key}` }
    })
    .then(async (response: AxiosResponse): Promise<SchemaStructureDataInclusion[]> => {
      const allPagesData: SchemaStructureDataInclusion[] = await fetchAllPages(
        dataInclusionStructureUrl,
        dataInclusionOptions,
        response.data.pages
      );
      return [...response.data.items, ...allPagesData];
    });

const fetchDataInclusionServices = async (
  dataInclusionOptions: DataInclusionOptions,
  dataInclusionServiceUrl: string
): Promise<SchemaServiceDataInclusion[]> =>
  axios
    .get(`${dataInclusionServiceUrl}&page=1`, {
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      headers: { Authorization: `Bearer ${getApiKey(dataInclusionOptions).key}` }
    })
    .then(async (response: AxiosResponse): Promise<SchemaServiceDataInclusion[]> => {
      const allPagesData: SchemaServiceDataInclusion[] = await fetchAllPages(
        dataInclusionServiceUrl,
        dataInclusionOptions,
        response.data.pages
      );
      return [...response.data.items, ...allPagesData];
    });

export const dataInclusionAction = async (dataInclusionOptions: DataInclusionOptions): Promise<void> => {
  const dataInclusionStructureUrl: string = 'https://api.data.inclusion.beta.gouv.fr/api/v0/structures?thematique=numerique';
  const dataInclusionServiceUrl: string = 'https://api.data.inclusion.beta.gouv.fr/api/v0/services?thematique=numerique';

  const responseStructures: SchemaStructureDataInclusion[] = await fetchDataInclusionStructures(
    dataInclusionOptions,
    dataInclusionStructureUrl
  );

  const responseServices: SchemaServiceDataInclusion[] = await fetchDataInclusionServices(
    dataInclusionOptions,
    dataInclusionServiceUrl
  );

  fs.writeFileSync(
    dataInclusionOptions.outputFile,
    filePayload(dataInclusionOptions.filter)(responseStructures, responseServices),
    'utf8'
  );
};
