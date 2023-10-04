/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import * as fs from 'fs';
import {
  accesLibreFromS3,
  communeFromGeoApi,
  fingerprintsFromFile,
  isInQpv,
  isInZrr,
  qpvFromDataGouv,
  writeErrorsInFiles,
  writeFingerprints,
  writeOutputsInFiles,
  zrrFromEquipementsSportsGouvApi
} from '../../data';
import { findCommune } from '../../fields';
import { LieuxMediationNumeriqueMatching } from '../../input';
import { LieuxDeMediationNumeriqueTransformationRepository } from '../../repositories';
import { diffSinceLastTransform, Fingerprint } from '../diff-since-last-transform';
import { TransformerOptions } from '../transformer-options';

export const lieuxDeMediationNumeriqueTransformation = async (
  transformerOptions: TransformerOptions
): Promise<LieuxDeMediationNumeriqueTransformationRepository> => {
  const config: LieuxMediationNumeriqueMatching = JSON.parse(
    await fs.promises.readFile(transformerOptions.configFile, 'utf-8')
  );
  const idKey: string = config.id?.colonne ?? '';
  const fingerprints: Fingerprint[] = await fingerprintsFromFile(transformerOptions);

  return {
    config,
    accesLibre: await accesLibreFromS3(),
    findCommune: findCommune(await communeFromGeoApi()),
    isInQpv: isInQpv(await qpvFromDataGouv()),
    isInZrr: isInZrr(await zrrFromEquipementsSportsGouvApi()),
    fingerprints,
    writeErrors: writeErrorsInFiles(transformerOptions),
    writeOutputs: writeOutputsInFiles(transformerOptions),
    diffSinceLastTransform: diffSinceLastTransform(idKey, fingerprints),
    writeFingerprints: writeFingerprints(idKey, fingerprints, transformerOptions)
  };
};
