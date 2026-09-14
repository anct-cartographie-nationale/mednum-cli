import axios from 'axios';
import type { Commune } from '../collectivites/index.js';

const COMMUNES_URL = 'https://geo.api.gouv.fr/communes';

export const fetchCommunes = async (): Promise<Commune[]> => (await axios.get<Commune[]>(COMMUNES_URL)).data;
