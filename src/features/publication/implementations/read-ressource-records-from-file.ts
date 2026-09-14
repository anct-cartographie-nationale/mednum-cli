import * as fs from 'node:fs';
import type { ReadRessourceRecords } from '../keys';

export const readRessourceRecordsFromFile: ReadRessourceRecords = (source: string): unknown[] =>
  JSON.parse(fs.readFileSync(source, 'utf8'));
