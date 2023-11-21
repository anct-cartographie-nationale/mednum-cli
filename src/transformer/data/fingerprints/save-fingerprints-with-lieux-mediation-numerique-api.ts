import axios, { AxiosResponse } from 'axios';
import { authHeader, headers } from '../../../common';
import {
  canTransform,
  DiffSinceLastTransform,
  Fingerprint,
  fingerprintsFrom,
  FingerprintToDelete
} from '../../cli/diff-since-last-transform';
import { TransformerOptions } from '../../cli/transformer-options';

export const saveFingerprintsWithLieuxMediationNumeriqueApi =
  (idKey: string, transformerOptions: TransformerOptions) =>
  async (itemsToTransform: DiffSinceLastTransform): Promise<void> => {
    canTransform(itemsToTransform) &&
      transformerOptions.cartographieNationaleApiKey != null &&
      (await axios.patch<unknown, AxiosResponse, (Fingerprint | FingerprintToDelete)[]>(
        `${transformerOptions.cartographieNationaleApiUrl}/lieux-inclusion-numerique/fingerprints/${transformerOptions.sourceName}`,
        [...fingerprintsFrom(itemsToTransform.toUpsert, idKey), ...itemsToTransform.toDelete],
        headers(authHeader(transformerOptions.cartographieNationaleApiKey))
      ));
  };
