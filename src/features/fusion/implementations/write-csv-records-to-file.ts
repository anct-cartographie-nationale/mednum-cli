import { toCsvText } from '../../../libraries/csv/index';
import { writeTextFileSync } from '../../../libraries/file-system/index';
import type { WriteRecordsToFile } from '../keys/index';

export const writeCsvRecordsToFile: WriteRecordsToFile = (filePath: string, records: unknown[]): void =>
  writeTextFileSync(filePath, toCsvText(records));
