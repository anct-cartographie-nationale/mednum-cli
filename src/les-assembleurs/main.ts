/* eslint-disable no-console,@typescript-eslint/no-restricted-imports,no-undef */

import * as fs from 'fs';
import { isOpeningHours, LesAssembleursData, LesAssembleursItem } from './helpers';
import { toOsmHours } from '../tools';
import ErrnoException = NodeJS.ErrnoException;

const SOURCE_PATH: string = './assets/input/';
const LES_ASSEMBLEURS_FILE: string = 'les-assembleurs.json';

fs.readFile(`${SOURCE_PATH}${LES_ASSEMBLEURS_FILE}`, 'utf8', (readError: ErrnoException | null, dataString: string): void => {
  if (readError != null) {
    console.error(readError);
    return undefined;
  }

  const data: LesAssembleursData = JSON.parse(dataString);
  const pattern: RegExp = /^\d\d:\d\d-\d\d:\d\d(?:,\d\d:\d\d-\d\d:\d\d)?$/u;

  data
    .map((item: LesAssembleursItem): string => item['horaires lundi'])
    // .map((item: LesAssembleursItem): string => item['horaires mardi'])
    // .map((item: LesAssembleursItem): string => item['horaires mercredi'])
    // .map((item: LesAssembleursItem): string => item['horaires jeudi'])
    // .map((item: LesAssembleursItem): string => item['horaires vendredi'])
    // .map((item: LesAssembleursItem): string => item['horaires samedi'])
    // .map((item: LesAssembleursItem): string => item['horaires dimanche'])
    .filter(isOpeningHours)
    .forEach((hours: string, index: number): void => {
      if (pattern.test(toOsmHours(hours))) return;
      console.warn(index, '\t', toOsmHours(hours), '\t\t\t', hours);
    });

  return undefined;
});
