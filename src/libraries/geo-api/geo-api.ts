import axios from 'axios';
import type { Commune } from '../collectivites';

const COMMUNES_URL = 'https://geo.api.gouv.fr/communes';

/**
 * Le référentiel des communes. Vérifier que la réponse est bien une liste, faute de quoi
 * l'échec n'apparaîtrait qu'au moment de l'indexer, loin d'ici et sans dire pourquoi. Le
 * contenu des communes, lui, reste une affirmation que rien ne vérifie.
 */
export const fetchCommunes = async (): Promise<Commune[]> => {
  const body: unknown = (await axios.get(COMMUNES_URL)).data;

  if (!Array.isArray(body)) throw new Error(`Réponse de geo.api.gouv.fr sans liste de communes : ${COMMUNES_URL}`);

  return body as Commune[];
};
