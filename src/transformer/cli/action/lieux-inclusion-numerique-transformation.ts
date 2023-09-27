/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import * as fs from 'fs';
import {
  qpvFromDataGouv,
  zrrFromEquipementsSportsGouvApi,
  communeFromGeoApi,
  accesLibreFromS3,
  isInQpv,
  isInZrr
} from '../../data';
import { findCommune } from '../../fields';
import { LieuxDeMediationNumeriqueTransformationRepository } from '../../repositories';
import { TransformerOptions } from '../transformer-options';

export const lieuxDeMediationNumeriqueTransformation = async (
  transformerOptions: TransformerOptions
): Promise<LieuxDeMediationNumeriqueTransformationRepository> => ({
  config: JSON.parse(await fs.promises.readFile(transformerOptions.configFile, 'utf-8')),
  accesLibre: await accesLibreFromS3(),
  findCommune: findCommune(await communeFromGeoApi()),
  isInQpv: isInQpv(await qpvFromDataGouv()),
  isInZrr: isInZrr(await zrrFromEquipementsSportsGouvApi())
});
