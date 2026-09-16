import { readJsonFile } from '../../../libraries/file-system';
import type { ReadRecordsFromFile } from '../keys';

export const readJsonRecordsFromFile: ReadRecordsFromFile = (filePath: string): unknown[] =>
  (readJsonFile(filePath) ?? []) as unknown[];
