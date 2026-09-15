import type { IsInQpv } from '../../../../libraries/collectivites';
import { inject } from '../../../../libraries/injection';
import { isInQpv } from '../../domain';
import { LOAD_QPV_SHAPES } from '../../keys';

/**
 * Prépare le test d'appartenance d'un lieu à un quartier prioritaire de la politique de la ville.
 */
export const qualifierQpv = async (): Promise<IsInQpv> => isInQpv(await inject(LOAD_QPV_SHAPES)());
