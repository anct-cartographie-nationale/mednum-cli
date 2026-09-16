import { type InjectionKey, keyFor } from '../../../libraries/injection';
import type { MergeFormat } from '../domain';

export type ReadRecordsFromFile = (filePath: string) => unknown[];

export type ReadRecords = (format: MergeFormat) => ReadRecordsFromFile;

export const READ_RECORDS: InjectionKey<ReadRecords> = keyFor<ReadRecords>('fusion.read-records');
