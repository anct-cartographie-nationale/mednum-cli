/* eslint-disable @typescript-eslint/no-restricted-imports */

import * as fs from 'fs';
import { fromSchemaLieuxDeMediationNumerique, LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import ErrnoException = NodeJS.ErrnoException;
import { writeOutputFiles } from '../mednum/transformer/output';

const SOURCE_PATH: string = './assets/input/';
const SOURCE_FILE: string = 'cnfs.json';

const NAME: string = 'CnFS';
const TERRITOIRE: string = 'france';

fs.readFile(`${SOURCE_PATH}${SOURCE_FILE}`, 'utf8', (_: ErrnoException | null, dataString: string): void => {
  const lieuxDeMediationNumerique: LieuMediationNumerique[] = fromSchemaLieuxDeMediationNumerique(JSON.parse(dataString));

  writeOutputFiles({
    path: `./assets/output/${NAME}`,
    name: NAME,
    territoire: TERRITOIRE
  })(lieuxDeMediationNumerique);

  return undefined;
});
