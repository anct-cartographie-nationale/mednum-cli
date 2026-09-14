import {
  type LieuMediationNumerique,
  type SchemaLieuMediationNumerique,
  toSchemaLieuMediationNumerique
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { patchLieux } from '../../../../libraries/cartographie-nationale-api/index.js';
import type { Api } from '../../../../libraries/http/index.js';

const onlyDefined = <T>(nullable?: T): nullable is T => nullable != null;

export const saveOutputsWithLieuxInclusionNumeriqueApi =
  (api: Api) =>
  async (lieuxMediationNumerique: LieuMediationNumerique[]): Promise<void> => {
    if (api.key == null) return;

    await patchLieux<SchemaLieuMediationNumerique>(
      api,
      lieuxMediationNumerique
        .filter(onlyDefined)
        .map((lieu: LieuMediationNumerique): SchemaLieuMediationNumerique => toSchemaLieuMediationNumerique(lieu))
    );
  };
