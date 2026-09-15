import { readJsonFileIfExists } from '../../../../libraries/file-system/index.js';
import type { Fingerprint } from '../../domain/index.js';

/**
 * Un fichier d'empreintes absent signifie qu'aucune transformation précédente n'a eu lieu.
 *
 * Un fichier présent mais illisible ne signifie pas la même chose et ne doit pas être traité
 * comme tel : le confondre avec l'absence ferait retransformer tout le jeu en silence, puis
 * écraser les empreintes, sans que rien ne dise que le fichier était corrompu.
 */
export const fingerprintsFromFile = (fingerprintFile: string) => async (): Promise<Fingerprint[]> =>
  (readJsonFileIfExists(fingerprintFile) ?? []) as Fingerprint[];
