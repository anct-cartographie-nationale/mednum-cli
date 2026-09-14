import { type InjectionKey, keyFor } from '../../../libraries/injection/index.js';
import type { MergeFormat } from '../domain/index.js';

export type ReadRecords = (format: MergeFormat) => (filePath: string) => unknown[];

export const READ_RECORDS: InjectionKey<ReadRecords> = keyFor<ReadRecords>('fusion.read-records');
