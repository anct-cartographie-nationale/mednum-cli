import axios from 'axios';
import { Fingerprint } from '../../cli/diff-since-last-transform';
import { TransformerOptions } from '../../cli/transformer-options';

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
