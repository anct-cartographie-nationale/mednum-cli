/* eslint-disable */

import * as fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;
import { isOpeningHours, LesAssembleursData, LesAssembleursItem } from './helpers';
import { toOsmHours } from '../tools';

const SOURCE_PATH: string = './assets/input/';
const LES_ASSEMBLEURS_FILE: string = 'les-assembleurs.json';

fs.readFile(`${SOURCE_PATH}${LES_ASSEMBLEURS_FILE}`, 'utf8', (err: ErrnoException | null, dataString: string) => {
  if (err) {
    return console.log(err);
  }

  const data: LesAssembleursData = JSON.parse(dataString);
  const pattern = /^\d\d:\d\d-\d\d:\d\d(?:,\d\d:\d\d-\d\d:\d\d)?$/u;

  data
    .map((item: LesAssembleursItem) => {
      return item['horaires lundi'];
      // return item['horaires mardi'];
      // return item['horaires mercredi'];
      // return item['horaires jeudi'];
      // return item['horaires vendredi'];
      // return item['horaires samedi'];
      // return item['horaires dimanche'];
    })
    .filter(isOpeningHours)
    .forEach((hours: string, index: number) => {
      if (pattern.test(toOsmHours(hours) ?? '')) return;
      console.log(index, '\t', toOsmHours(hours), '\t\t\t', hours);
    });
});
