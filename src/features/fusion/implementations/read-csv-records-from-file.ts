import { parseCsvRecords } from '../../../libraries/csv/index.js';
import { readTextFileSync } from '../../../libraries/file-system/index.js';
import type { ReadRecordsFromFile } from '../keys/index.js';

export const readCsvRecordsFromFile: ReadRecordsFromFile = (filePath: string): unknown[] =>
  parseCsvRecords(readTextFileSync(filePath));
