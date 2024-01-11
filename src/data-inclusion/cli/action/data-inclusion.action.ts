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

const getApi = (properties: DataInclusionOptions): Api => ({
  key: properties.dataInclusionApiKey
});

const fetchAllPages = async <T extends SchemaStructureDataInclusion | SchemaServiceDataInclusion>(
  apiUrl: string,
  dataInclusionOptions: DataInclusionOptions,
  totalPages: number
): Promise<T[]> => {
  let allData: T[] = [];

  for (let page = 1; page <= totalPages; page++) {
    try {
      const url = `${apiUrl}&page=${page}`;
      const response: AxiosResponse = await axios.get(url, {
        headers: { Authorization: `Bearer ${getApi(dataInclusionOptions).key}` }
      });
      allData.push(...response.data.items);
    } catch (error) {
      break;
    }
  }

  return allData;
};

export const dataInclusionAction = async (dataInclusionOptions: DataInclusionOptions): Promise<void> => {
  const dataInclusionStructureUrl: string = 'https://api.data.inclusion.beta.gouv.fr/api/v0/structures?thematique=numerique';
  const dataInclusionServiceUrl: string = 'https://api.data.inclusion.beta.gouv.fr/api/v0/services?thematique=numerique';

  const responseStructures: SchemaStructureDataInclusion[] = await axios
    .get(`${dataInclusionStructureUrl}&page=1`, {
      headers: { Authorization: `Bearer ${getApi(dataInclusionOptions).key}` }
    })
    .then(async (response) => {
      let allPagesData: SchemaStructureDataInclusion[] = await fetchAllPages(
        dataInclusionStructureUrl,
        dataInclusionOptions,
        response.data.pages
      );
      return [...response.data.items, ...allPagesData];
    });

  const responseServices: SchemaServiceDataInclusion[] = await axios
    .get(`${dataInclusionServiceUrl}&page=1`, {
      headers: { Authorization: `Bearer ${getApi(dataInclusionOptions).key}` }
    })
    .then(async (response) => {
      let allPagesData: SchemaServiceDataInclusion[] = await fetchAllPages(
        dataInclusionServiceUrl,
        dataInclusionOptions,
        response.data.pages
      );
      return [...response.data.items, ...allPagesData];
    });

  fs.writeFileSync(
    dataInclusionOptions.outputFile,
    filePayload(dataInclusionOptions.filter)(responseStructures, responseServices),
    'utf8'
  );
};
