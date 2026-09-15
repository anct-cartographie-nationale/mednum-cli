import type { IsInQpv } from '../../../../libraries/collectivites/index';
import { inject } from '../../../../libraries/injection/index';
import { isInQpv } from '../../domain/index';
import { LOAD_QPV_SHAPES } from '../../keys/index';

/**
 * Prépare le test d'appartenance d'un lieu à un quartier prioritaire de la politique de la ville.
 */
export const qualifierQpv = async (): Promise<IsInQpv> => isInQpv(await inject(LOAD_QPV_SHAPES)());
