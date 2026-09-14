import type { Commune } from '../../../libraries/collectivites/index.js';
import { fetchCommunes } from '../../../libraries/geo-api/index.js';
import type { LoadCommunes } from '../keys/index.js';

export const communesFromGeoApi: LoadCommunes = async (): Promise<Commune[]> => fetchCommunes();
