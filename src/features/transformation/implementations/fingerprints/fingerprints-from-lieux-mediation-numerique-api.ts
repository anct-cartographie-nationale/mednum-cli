import { fetchFingerprints } from '../../../../libraries/cartographie-nationale-api';
import type { Api } from '../../../../libraries/http';
import type { Fingerprint } from '../../domain';

export const fingerprintsFromLieuxMediationNumeriqueApi =
  (api: Api, sourceName: string) => async (): Promise<Fingerprint[]> => {
    try {
      return await fetchFingerprints(api, sourceName);
    } catch {
      return [];
    }
  };
