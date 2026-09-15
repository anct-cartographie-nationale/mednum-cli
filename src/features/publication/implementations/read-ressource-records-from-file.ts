import { readJsonFile } from '../../../libraries/file-system/index';
import type { ReadRessourceRecords } from '../keys/index';

export const readRessourceRecordsFromFile: ReadRessourceRecords = (source: string): unknown[] =>
  readJsonFile(source) as unknown[];
