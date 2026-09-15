import { writeTextFileSync } from '../../../libraries/file-system/index.js';
import type { WriteRecordsToFile } from '../keys/index.js';

export const writeJsonRecordsToFile: WriteRecordsToFile = (filePath: string, records: unknown[]): void =>
  writeTextFileSync(filePath, JSON.stringify(records, null, 2));
