import { toCsvText } from '../../../libraries/csv';
import { writeTextFileSync } from '../../../libraries/file-system';
import type { WriteRecordsToFile } from '../keys';

export const writeCsvRecordsToFile: WriteRecordsToFile = (filePath: string, records: unknown[]): void =>
  writeTextFileSync(filePath, toCsvText(records));
