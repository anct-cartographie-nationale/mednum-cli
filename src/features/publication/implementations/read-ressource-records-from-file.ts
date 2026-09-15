import { readJsonFile } from '../../../libraries/file-system/index.js';
import type { ReadRessourceRecords } from '../keys/index.js';

export const readRessourceRecordsFromFile: ReadRessourceRecords = (source: string): unknown[] =>
  readJsonFile(source) as unknown[];
