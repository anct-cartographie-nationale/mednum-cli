/* eslint-disable @typescript-eslint/no-restricted-imports, @typescript-eslint/no-floating-promises */

import * as fs from 'fs';
import axios, { AxiosResponse } from 'axios';
import { structuresWithServicesNumeriques } from './merge-services-in-structure';
import { SchemaServiceDataInclusion, SchemaStructureDataInclusion } from '@gouvfr-anct/lieux-de-mediation-numerique';

const NAME: 'data-inclusion' = 'data-inclusion' as const;

const dataInclusionFetch = async (): Promise<void> => {
  const responseStructures: AxiosResponse = await axios.get(
    'https://www.data.gouv.fr/fr/datasets/r/4fc64287-e869-4550-8fb9-b1e0b7809ffa'
  );

  const responseServices: AxiosResponse = await axios.get(
    'https://www.data.gouv.fr/fr/datasets/r/0eac1faa-66f9-4e49-8fb3-f0721027d89f'
  );

  fs.writeFileSync(
    `./assets/input/${NAME}/${NAME}.json`,
    JSON.stringify(structuresWithServicesNumeriques(responseStructures.data, responseServices.data)),
    'utf8'
  );
};
dataInclusionFetch();
