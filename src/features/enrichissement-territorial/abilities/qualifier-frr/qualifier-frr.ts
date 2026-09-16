import type { IsInFrr } from '../../../../libraries/collectivites';
import { inject } from '../../../../libraries/injection';
import { isInFrr } from '../../domain';
import { LOAD_FRR } from '../../keys';

/**
 * Prépare le test d'appartenance d'une commune au zonage France Ruralités Revitalisation.
 */
export const qualifierFrr = async (): Promise<IsInFrr> => isInFrr(await inject(LOAD_FRR)());
