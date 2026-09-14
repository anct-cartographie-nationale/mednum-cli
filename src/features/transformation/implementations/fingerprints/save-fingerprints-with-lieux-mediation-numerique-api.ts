import { patchFingerprints } from '../../../../libraries/cartographie-nationale-api/index.js';
import type { Api } from '../../../../libraries/http/index.js';
import { canTransform, type DiffSinceLastTransform, fingerprintsFrom } from '../../domain/index.js';

export const saveFingerprintsWithLieuxMediationNumeriqueApi =
  (idKey: string, api: Api, sourceName: string) =>
  async (itemsToTransform: DiffSinceLastTransform): Promise<void> => {
    if (!canTransform(itemsToTransform) || api.key == null) return;

    await patchFingerprints(api, sourceName, [
      ...fingerprintsFrom(itemsToTransform.toUpsert, idKey),
      ...itemsToTransform.toDelete
    ]);
  };
