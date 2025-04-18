import * as fs from 'fs';
import {
  communeFromGeoApi,
  fingerprintsFromFile,
  isInQpv,
  isInZrr,
  qpvFromDataGouv,
  writeErrorsInFiles,
  zrrFromEquipementsSportsGouvApi,
  saveFingerprintsWithLieuxMediationNumeriqueApi,
  saveOutputsWithLieuxInclusionNumeriqueApi,
  fingerprintsFromLieuxMediationNumeriqueApi,
  saveOutputsInFiles,
  saveFingerprintsInFile,
  localisationByGeocode
} from '../../data';
import { findCommune } from '../../fields';
import { LieuxMediationNumeriqueMatching } from '../../input';
import { TransformationRepository } from '../../repositories';
import { diffSinceLastTransform, Fingerprint } from '../diff-since-last-transform';
import { TransformerOptions } from '../transformer-options';

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
    findCommune: findCommune(await communeFromGeoApi()),
    isInQpv: isInQpv(await qpvFromDataGouv()),
    isInZrr: isInZrr(await zrrFromEquipementsSportsGouvApi()),
    geocode: localisationByGeocode,
    fingerprints,
    saveErrors: writeErrorsInFiles(transformerOptions),
    saveOutputs: useFile
      ? saveOutputsInFiles(transformerOptions)
      : saveOutputsWithLieuxInclusionNumeriqueApi(transformerOptions),
    diffSinceLastTransform: diffSinceLastTransform(idKey, fingerprints),
    saveFingerprints: useFile
      ? saveFingerprintsInFile(idKey, fingerprints, transformerOptions)
      : saveFingerprintsWithLieuxMediationNumeriqueApi(idKey, transformerOptions)
  };
};
