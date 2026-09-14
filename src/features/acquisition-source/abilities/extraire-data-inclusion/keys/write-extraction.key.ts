import { type InjectionKey, keyFor } from '../../../../../libraries/injection/index.js';
import type { DataInclusionMerged } from '../domain/index.js';

export type WriteExtraction = (outputFile: string, records: DataInclusionMerged[]) => void;

export const WRITE_EXTRACTION: InjectionKey<WriteExtraction> = keyFor<WriteExtraction>('acquisition-source.write-extraction');
