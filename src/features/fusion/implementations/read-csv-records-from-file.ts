import { parseCsvRecords } from '../../../libraries/csv/index';
import { readTextFileSync } from '../../../libraries/file-system/index';
import type { ReadRecordsFromFile } from '../keys/index';

export const readCsvRecordsFromFile: ReadRecordsFromFile = (filePath: string): unknown[] =>
  parseCsvRecords(readTextFileSync(filePath));
