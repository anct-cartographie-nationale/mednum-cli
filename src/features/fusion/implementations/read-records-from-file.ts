import * as fs from 'node:fs';
import { parse } from 'csv-parse/sync';
import type { MergeFormat } from '../domain';
import type { ReadRecords } from '../keys';

const readCsvRecords = (filePath: string): unknown[] => parse(fs.readFileSync(filePath, 'utf-8'), { columns: true });

const readJsonRecords = (filePath: string): unknown[] => JSON.parse(fs.readFileSync(filePath, 'utf-8')) ?? [];

const READERS: Record<MergeFormat, (filePath: string) => unknown[]> = {
  '.csv': readCsvRecords,
  '.json': readJsonRecords
};

export const readRecordsFromFile: ReadRecords = (format: MergeFormat) => READERS[format];
