import { type InjectionKey, keyFor } from '../../../libraries/injection/index';
import type { MergeFormat } from '../domain/index';

export type ReadRecordsFromFile = (filePath: string) => unknown[];

export type ReadRecords = (format: MergeFormat) => ReadRecordsFromFile;

export const READ_RECORDS: InjectionKey<ReadRecords> = keyFor<ReadRecords>('fusion.read-records');
