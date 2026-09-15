import type { Commune } from '../../../libraries/collectivites';
import { fetchCommunes } from '../../../libraries/geo-api';
import type { LoadCommunes } from '../keys';

export const communesFromGeoApi: LoadCommunes = async (): Promise<Commune[]> => fetchCommunes();
