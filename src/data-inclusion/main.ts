/* eslint-disable @typescript-eslint/no-restricted-imports,max-lines-per-function,@typescript-eslint/naming-convention, camelcase,  max-lines, @typescript-eslint/no-floating-promises */

import * as fs from 'fs';
import axios, { AxiosResponse } from 'axios';
import { SchemaServiceDataInclusion, SchemaStructureDataInclusion } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DataInclusionMerged, mergeServicesInStructure } from './merge-services-in-structure';

export type SchemaStructureDataInclusionWithServices = SchemaStructureDataInclusion & {
  services: string;
  labels_nat: string;
  labels_autre: string;
};

const NAME: string = 'data-inclusion';

const onlyWithNumeriqueServices = (ataInclusionMerged: DataInclusionMerged): boolean =>
  ataInclusionMerged.services.some(
    (service: SchemaServiceDataInclusion): boolean => service.thematiques?.includes('numerique') ?? false
  );

const toMergeDataInclusionWithServices =
  (dataInclusionServices: SchemaServiceDataInclusion[]) =>
  (structure: SchemaStructureDataInclusion): DataInclusionMerged =>
    mergeServicesInStructure(dataInclusionServices, structure);

const dataInclusionFetch = async (): Promise<void> => {
  const responseStructures: AxiosResponse = await axios.get(
    'https://www.data.gouv.fr/fr/datasets/r/4fc64287-e869-4550-8fb9-b1e0b7809ffa'
  );
  const dataInclusionStructures: SchemaStructureDataInclusion[] = responseStructures.data;

  const responseServices: AxiosResponse = await axios.get(
    'https://www.data.gouv.fr/fr/datasets/r/0eac1faa-66f9-4e49-8fb3-f0721027d89f'
  );
  const dataInclusionServices: SchemaServiceDataInclusion[] = responseServices.data;

  const structuresWithServices: DataInclusionMerged[] = dataInclusionStructures
    .map(toMergeDataInclusionWithServices(dataInclusionServices))
    .filter(onlyWithNumeriqueServices);

  fs.writeFileSync(`./assets/input/${NAME}/${NAME}.json`, JSON.stringify(structuresWithServices), 'utf8');
};
dataInclusionFetch();
