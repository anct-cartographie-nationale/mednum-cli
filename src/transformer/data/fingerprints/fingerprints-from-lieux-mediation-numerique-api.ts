import axios from 'axios';
import type { Fingerprint } from '../../cli/diff-since-last-transform';
import type { TransformerOptions } from '../../cli/transformer-options';

export const fingerprintsFromLieuxMediationNumeriqueApi = async (
  transformerOptions: TransformerOptions
): Promise<Fingerprint[]> => {
  try {
    return (
      await axios.get<Omit<Fingerprint, 'source'>[]>(
        `${transformerOptions.cartographieNationaleApiUrl}/lieux-inclusion-numerique/fingerprints/${transformerOptions.sourceName}`
      )
    ).data;
  } catch {
    return [];
  }
};
