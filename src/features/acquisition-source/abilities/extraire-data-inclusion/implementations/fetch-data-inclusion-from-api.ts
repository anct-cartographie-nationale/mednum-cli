import { servicesFromDataInclusionApi, structuresFromDataInclusionApi } from '../../../../../libraries/data-inclusion-api';
import type { DataInclusionExtraction } from '../domain';
import type { FetchDataInclusion } from '../keys';

export const fetchDataInclusionFromApi: FetchDataInclusion = async (
  apiKey: string,
  sources: string
): Promise<DataInclusionExtraction> => ({
  structures: await structuresFromDataInclusionApi(apiKey, sources),
  services: await servicesFromDataInclusionApi(apiKey, sources)
});
