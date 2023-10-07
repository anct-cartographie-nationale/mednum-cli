import axios from 'axios';
import { Commune } from '../../fields';

export const communeFromGeoApi = async (): Promise<Commune[]> => (await axios.get('https://geo.api.gouv.fr/communes')).data;
