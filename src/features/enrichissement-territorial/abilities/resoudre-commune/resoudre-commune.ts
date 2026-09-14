import type { FindCommune } from '../../../../libraries/collectivites/index.js';
import { inject } from '../../../../libraries/injection/index.js';
import { findCommune } from '../../domain/index.js';
import { LOAD_COMMUNES } from '../../keys/index.js';

/**
 * Prépare la résolution d'une commune à partir de son nom, de son code postal, ou des deux.
 */
export const resoudreCommune = async (): Promise<FindCommune> => findCommune(await inject(LOAD_COMMUNES)());
