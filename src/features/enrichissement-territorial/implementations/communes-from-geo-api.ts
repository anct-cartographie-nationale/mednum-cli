import type { Commune } from '../../../libraries/collectivites/index';
import { fetchCommunes } from '../../../libraries/geo-api/index';
import type { LoadCommunes } from '../keys/index';

export const communesFromGeoApi: LoadCommunes = async (): Promise<Commune[]> => fetchCommunes();
