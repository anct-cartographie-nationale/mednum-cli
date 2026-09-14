import { fetchFingerprints } from '../../../../libraries/cartographie-nationale-api/index.js';
import type { Api } from '../../../../libraries/http/index.js';
import type { Fingerprint } from '../../domain/index.js';

export const fingerprintsFromLieuxMediationNumeriqueApi =
  (api: Api, sourceName: string) => async (): Promise<Fingerprint[]> => {
    try {
      return await fetchFingerprints(api, sourceName);
    } catch {
      return [];
    }
  };
