import type { FindCommune } from '../../../../libraries/collectivites';
import { inject } from '../../../../libraries/injection';
import { findCommune } from '../../domain';
import { LOAD_COMMUNES } from '../../keys';

/**
 * Prépare la résolution d'une commune à partir de son nom, de son code postal, ou des deux.
 */
export const resoudreCommune = async (): Promise<FindCommune> => findCommune(await inject(LOAD_COMMUNES)());
