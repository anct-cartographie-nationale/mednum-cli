import {
  servicesFromDataInclusionApi,
  structuresFromDataInclusionApi
} from '../../../../../libraries/data-inclusion-api/index';
import type { DataInclusionExtraction } from '../domain/index';
import type { FetchDataInclusion } from '../keys/index';

export const fetchDataInclusionFromApi: FetchDataInclusion = async (
  apiKey: string,
  sources: string
): Promise<DataInclusionExtraction> => ({
  structures: await structuresFromDataInclusionApi(apiKey, sources),
  services: await servicesFromDataInclusionApi(apiKey, sources)
});
