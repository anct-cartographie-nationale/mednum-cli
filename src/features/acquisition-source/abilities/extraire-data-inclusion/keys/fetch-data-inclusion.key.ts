import { type InjectionKey, keyFor } from '../../../../../libraries/injection/index';
import type { DataInclusionExtraction } from '../domain/index';

export type FetchDataInclusion = (apiKey: string, sources: string) => Promise<DataInclusionExtraction>;

export const FETCH_DATA_INCLUSION: InjectionKey<FetchDataInclusion> = keyFor<FetchDataInclusion>(
  'acquisition-source.fetch-data-inclusion'
);
