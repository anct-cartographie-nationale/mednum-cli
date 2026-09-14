import {
  servicesFromDataInclusionApi,
  structuresFromDataInclusionApi
} from '../../../../../libraries/data-inclusion-api/index.js';
import type { DataInclusionExtraction } from '../domain/index.js';
import type { FetchDataInclusion } from '../keys/index.js';

export const fetchDataInclusionFromApi: FetchDataInclusion = async (
  apiKey: string,
  sources: string
): Promise<DataInclusionExtraction> => ({
  structures: await structuresFromDataInclusionApi(apiKey, sources),
  services: await servicesFromDataInclusionApi(apiKey, sources)
});
