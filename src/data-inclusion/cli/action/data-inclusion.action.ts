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

export const dataInclusionAction = async (dataInclusionOptions: DataInclusionOptions): Promise<void> => {
  const responseStructures: AxiosResponse = await axios.get(
    'https://www.data.gouv.fr/fr/datasets/r/4fc64287-e869-4550-8fb9-b1e0b7809ffa'
  );

  const responseServices: AxiosResponse = await axios.get(
    'https://www.data.gouv.fr/fr/datasets/r/0eac1faa-66f9-4e49-8fb3-f0721027d89f'
  );

  fs.writeFileSync(
    dataInclusionOptions.outputFile,
    filePayload(dataInclusionOptions.filter)(responseStructures.data, responseServices.data),
    'utf8'
  );
};
