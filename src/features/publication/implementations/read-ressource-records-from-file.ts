import { readJsonFile } from '../../../libraries/file-system';
import type { ReadRessourceRecords } from '../keys';

export const readRessourceRecordsFromFile: ReadRessourceRecords = (source: string): unknown[] =>
  readJsonFile(source) as unknown[];
