import { writeTextFileSync } from '../../../libraries/file-system';
import type { WriteRecordsToFile } from '../keys';

export const writeJsonRecordsToFile: WriteRecordsToFile = (filePath: string, records: unknown[]): void =>
  writeTextFileSync(filePath, JSON.stringify(records, null, 2));
