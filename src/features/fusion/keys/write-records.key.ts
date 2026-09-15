import { type InjectionKey, keyFor } from '../../../libraries/injection/index.js';
import type { MergeFormat } from '../domain/index.js';

export type WriteRecordsToFile = (filePath: string, records: unknown[]) => void;

export type WriteRecords = (format: MergeFormat) => WriteRecordsToFile;

export const WRITE_RECORDS: InjectionKey<WriteRecords> = keyFor<WriteRecords>('fusion.write-records');
