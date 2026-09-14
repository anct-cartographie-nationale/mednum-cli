import { type InjectionKey, keyFor } from '../../../libraries/injection';
import type { MergeFormat } from '../domain';

export type ReadRecords = (format: MergeFormat) => (filePath: string) => unknown[];

export const READ_RECORDS: InjectionKey<ReadRecords> = keyFor<ReadRecords>('fusion.read-records');
