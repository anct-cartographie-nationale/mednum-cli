/* eslint-disable @typescript-eslint/naming-convention, camelcase, @typescript-eslint/no-restricted-imports */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */

import * as fs from 'fs';
import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Report, toLieuxMediationNumerique, validValuesOnly, writeOutputFiles } from '../tools';

const SOURCE_FILE: string = './assets/input/maine-et-loire/maine-et-loire.json';
const CONFIG_FILE: string = './assets/input/maine-et-loire/maine-et-loire.config.json';
const NAME: string = 'maine-et-loire';
const TERRITOIRE: string = 'pays-de-la-loire';

const report: Report = Report();

Promise.all([fs.promises.readFile(SOURCE_FILE, 'utf-8'), fs.promises.readFile(CONFIG_FILE, 'utf-8')])
  .then(([dataString, matching]: [string, string]): void => {
    const lieuxDeMediationNumerique: LieuMediationNumerique[] = JSON.parse(dataString)
      .map(toLieuxMediationNumerique(matching, NAME, report))
      .filter(validValuesOnly);

    writeOutputFiles({
      id: NAME.toLowerCase().replace(/\s/gu, '-'),
      name: NAME,
      territoire: TERRITOIRE
    })(lieuxDeMediationNumerique);
  })
  .catch((error: Error): void => {
    /* eslint-disable-next-line no-console */
    console.error(error.message);
  });
