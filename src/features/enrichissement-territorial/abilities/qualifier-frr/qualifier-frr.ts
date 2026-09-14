import type { IsInFrr } from '../../../../libraries/collectivites/index.js';
import { inject } from '../../../../libraries/injection/index.js';
import { isInFrr } from '../../domain/index.js';
import { LOAD_FRR } from '../../keys/index.js';

/**
 * Prépare le test d'appartenance d'une commune au zonage France Ruralités Revitalisation.
 */
export const qualifierFrr = async (): Promise<IsInFrr> => isInFrr(await inject(LOAD_FRR)());
