import { patchFingerprints } from '../../../../libraries/cartographie-nationale-api';
import type { Api } from '../../../../libraries/http';
import { canTransform, type DiffSinceLastTransform, fingerprintsFrom } from '../../domain';

export const saveFingerprintsWithLieuxMediationNumeriqueApi =
  (idKey: string, api: Api, sourceName: string) =>
  async (itemsToTransform: DiffSinceLastTransform): Promise<void> => {
    if (!canTransform(itemsToTransform) || api.key == null) return;

    await patchFingerprints(api, sourceName, [
      ...fingerprintsFrom(itemsToTransform.toUpsert, idKey),
      ...itemsToTransform.toDelete
    ]);
  };
