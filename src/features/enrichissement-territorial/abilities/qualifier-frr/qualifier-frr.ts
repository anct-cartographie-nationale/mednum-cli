import type { IsInFrr } from '../../../../libraries/collectivites/index';
import { inject } from '../../../../libraries/injection/index';
import { isInFrr } from '../../domain/index';
import { LOAD_FRR } from '../../keys/index';

/**
 * Prépare le test d'appartenance d'une commune au zonage France Ruralités Revitalisation.
 */
export const qualifierFrr = async (): Promise<IsInFrr> => isInFrr(await inject(LOAD_FRR)());
