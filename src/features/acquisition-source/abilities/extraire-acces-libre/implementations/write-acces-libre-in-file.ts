import * as fs from 'node:fs';
import type { AccesLibreErp } from '../../../../../libraries/acces-libre';
import type { WriteAccesLibre } from '../keys';

export const writeAccesLibreInFile: WriteAccesLibre = (outputFile: string, erps: AccesLibreErp[]): void => {
  fs.writeFileSync(outputFile, JSON.stringify(erps), 'utf8');
};
