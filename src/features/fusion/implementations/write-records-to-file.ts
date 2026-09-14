import * as fs from 'node:fs';
import { stringify } from 'csv-stringify/sync';
import { createFolderIfNotExist } from '../../../libraries/file-system/write-file.js';
import { directoryOf } from '../../../libraries/file-system/path.js';
import type { MergeFormat } from '../domain/index.js';
import type { WriteRecords } from '../keys/index.js';

const writeCsvRecords = (filePath: string, records: unknown[]): void =>
  fs.writeFileSync(filePath, stringify(records, { header: true }), 'utf-8');

const writeJsonRecords = (filePath: string, records: unknown[]): void =>
  fs.writeFileSync(filePath, JSON.stringify(records, null, 2), 'utf-8');

const WRITERS: Record<MergeFormat, (filePath: string, records: unknown[]) => void> = {
  '.csv': writeCsvRecords,
  '.json': writeJsonRecords
};

export const writeRecordsToFile: WriteRecords =
  (format: MergeFormat) =>
  (filePath: string, records: unknown[]): void => {
    createFolderIfNotExist(directoryOf(filePath));
    WRITERS[format](filePath, records);
  };
