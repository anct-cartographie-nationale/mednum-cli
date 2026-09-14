import * as fs from 'node:fs';
import {
  fingerprintsFromFile,
  writeErrorsInFiles,
  writeAddressesInFiles,
  saveFingerprintsWithLieuxMediationNumeriqueApi,
  saveOutputsWithLieuxInclusionNumeriqueApi,
  fingerprintsFromLieuxMediationNumeriqueApi,
  saveOutputsInFiles,
  saveFingerprintsInFile,
  localisationByGeocode
} from '../../data';
import { qualifierFrr, qualifierQpv, resoudreCommune } from '../../../features/enrichissement-territorial';
import type { LieuxMediationNumeriqueMatching } from '../../input';
import type { TransformationRepository } from '../../repositories';
import { diffSinceLastTransform, type Fingerprint } from '../diff-since-last-transform';
import type { TransformerOptions } from '../transformer-options';

export const transformationRespository = async (transformerOptions: TransformerOptions): Promise<TransformationRepository> => {
  const useFile: boolean = transformerOptions.cartographieNationaleApiKey == null;
  const config: LieuxMediationNumeriqueMatching = JSON.parse(
    await fs.promises.readFile(transformerOptions.configFile, 'utf-8')
  );
  const idKey: string = config.id?.colonne ?? '';
  const fingerprints: Fingerprint[] = useFile
    ? await fingerprintsFromFile(transformerOptions)
    : await fingerprintsFromLieuxMediationNumeriqueApi(transformerOptions);

  return {
    config,
    findCommune: await resoudreCommune(),
    isInQpv: await qualifierQpv(),
    isInFrr: await qualifierFrr(),
    geocode: localisationByGeocode,
    fingerprints,
    saveErrors: writeErrorsInFiles(transformerOptions),
    saveAddresses: writeAddressesInFiles(transformerOptions),
    saveOutputs: useFile
      ? saveOutputsInFiles(transformerOptions)
      : saveOutputsWithLieuxInclusionNumeriqueApi(transformerOptions),
    diffSinceLastTransform: diffSinceLastTransform(idKey, fingerprints),
    saveFingerprints: useFile
      ? saveFingerprintsInFile(idKey, fingerprints, transformerOptions)
      : saveFingerprintsWithLieuxMediationNumeriqueApi(idKey, transformerOptions)
  };
};
