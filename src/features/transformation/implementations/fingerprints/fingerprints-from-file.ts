import * as fs from 'node:fs';
import type { Fingerprint } from '../../domain/index.js';

/**
 * Un fichier d'empreintes absent signifie qu'aucune transformation précédente n'a eu lieu.
 */
export const fingerprintsFromFile = (fingerprintFile: string) => async (): Promise<Fingerprint[]> => {
  try {
    return JSON.parse(await fs.promises.readFile(fingerprintFile, 'utf-8')) as Fingerprint[];
  } catch {
    return [];
  }
};
