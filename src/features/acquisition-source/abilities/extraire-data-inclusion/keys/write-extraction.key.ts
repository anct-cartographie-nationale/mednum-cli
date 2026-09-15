import { type InjectionKey, keyFor } from '../../../../../libraries/injection/index';
import type { DataInclusionMerged } from '../domain/index';

export type WriteExtraction = (outputFile: string, records: DataInclusionMerged[]) => void;

export const WRITE_EXTRACTION: InjectionKey<WriteExtraction> = keyFor<WriteExtraction>('acquisition-source.write-extraction');
