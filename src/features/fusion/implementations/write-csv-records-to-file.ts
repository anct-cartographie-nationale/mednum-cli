import { toCsvText } from '../../../libraries/csv/index.js';
import { writeTextFileSync } from '../../../libraries/file-system/index.js';
import type { WriteRecordsToFile } from '../keys/index.js';

export const writeCsvRecordsToFile: WriteRecordsToFile = (filePath: string, records: unknown[]): void =>
  writeTextFileSync(filePath, toCsvText(records));
