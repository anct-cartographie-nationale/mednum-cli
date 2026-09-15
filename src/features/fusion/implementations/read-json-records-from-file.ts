import { readJsonFile } from '../../../libraries/file-system/index';
import type { ReadRecordsFromFile } from '../keys/index';

export const readJsonRecordsFromFile: ReadRecordsFromFile = (filePath: string): unknown[] =>
  (readJsonFile(filePath) ?? []) as unknown[];
