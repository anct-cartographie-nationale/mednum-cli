import type { IsInQpv } from '../../../../libraries/collectivites/index.js';
import { inject } from '../../../../libraries/injection/index.js';
import { isInQpv } from '../../domain/index.js';
import { LOAD_QPV_SHAPES } from '../../keys/index.js';

/**
 * Prépare le test d'appartenance d'un lieu à un quartier prioritaire de la politique de la ville.
 */
export const qualifierQpv = async (): Promise<IsInQpv> => isInQpv(await inject(LOAD_QPV_SHAPES)());
