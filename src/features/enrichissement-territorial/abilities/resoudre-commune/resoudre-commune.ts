import type { FindCommune } from '../../../../libraries/collectivites/index';
import { inject } from '../../../../libraries/injection/index';
import { findCommune } from '../../domain/index';
import { LOAD_COMMUNES } from '../../keys/index';

/**
 * Prépare la résolution d'une commune à partir de son nom, de son code postal, ou des deux.
 */
export const resoudreCommune = async (): Promise<FindCommune> => findCommune(await inject(LOAD_COMMUNES)());
