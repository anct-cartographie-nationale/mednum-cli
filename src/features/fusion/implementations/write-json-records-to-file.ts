import { writeTextFileSync } from '../../../libraries/file-system/index';
import type { WriteRecordsToFile } from '../keys/index';

export const writeJsonRecordsToFile: WriteRecordsToFile = (filePath: string, records: unknown[]): void =>
  writeTextFileSync(filePath, JSON.stringify(records, null, 2));
