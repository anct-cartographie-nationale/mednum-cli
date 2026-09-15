import { parseCsvRecords } from '../../../libraries/csv';
import { readTextFileSync } from '../../../libraries/file-system';
import type { ReadRecordsFromFile } from '../keys';

export const readCsvRecordsFromFile: ReadRecordsFromFile = (filePath: string): unknown[] =>
  parseCsvRecords(readTextFileSync(filePath));
