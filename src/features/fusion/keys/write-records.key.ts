import { type InjectionKey, keyFor } from '../../../libraries/injection';
import type { MergeFormat } from '../domain';

export type WriteRecordsToFile = (filePath: string, records: unknown[]) => void;

export type WriteRecords = (format: MergeFormat) => WriteRecordsToFile;

export const WRITE_RECORDS: InjectionKey<WriteRecords> = keyFor<WriteRecords>('fusion.write-records');
