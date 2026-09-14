import { type InjectionKey, keyFor } from '../../../libraries/injection';
import type { MergeFormat } from '../domain';

export type WriteRecords = (format: MergeFormat) => (filePath: string, records: unknown[]) => void;

export const WRITE_RECORDS: InjectionKey<WriteRecords> = keyFor<WriteRecords>('fusion.write-records');
