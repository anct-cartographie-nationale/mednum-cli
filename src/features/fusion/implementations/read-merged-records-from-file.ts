import { readJsonFileIfExists } from '../../../libraries/file-system';
import type { ReadMergedRecords } from '../keys';

export const readMergedRecordsFromFile: ReadMergedRecords = (filePath: string): unknown[] =>
  (readJsonFileIfExists(filePath) ?? []) as unknown[];
