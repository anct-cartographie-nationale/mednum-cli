import { readJsonFile } from '../../../libraries/file-system/index.js';
import type { ReadRecordsFromFile } from '../keys/index.js';

export const readJsonRecordsFromFile: ReadRecordsFromFile = (filePath: string): unknown[] =>
  (readJsonFile(filePath) ?? []) as unknown[];
