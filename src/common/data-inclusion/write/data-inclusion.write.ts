import * as fs from 'fs';
import {
  LieuMediationNumerique,
  toSchemaServicesDataInclusion,
  toSchemaStructuresDataInclusion
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { createFolderIfNotExist, noEmptyCell, Output, throwWriteFileError } from '../../output-file';
import { dataInclusionFileName } from '../file-name/data-inclusion.file-name';

export const writeStructuresDataInclusionJsonOutput = (
  producer: Output,
  lieuxDeMediationNumerique: LieuMediationNumerique[],
  suffix?: string
): void => {
  fs.writeFile(
    `${createFolderIfNotExist(producer.path)}/${dataInclusionFileName(
      new Date(),
      producer.name,
      'structures',
      'json',
      suffix
    )}`,
    JSON.stringify(toSchemaStructuresDataInclusion(lieuxDeMediationNumerique), noEmptyCell),
    throwWriteFileError
  );
};

export const writeServicesDataInclusionJsonOutput = (
  producer: Output,
  lieuxDeMediationNumerique: LieuMediationNumerique[],
  suffix?: string
): void => {
  fs.writeFile(
    `${createFolderIfNotExist(producer.path)}/${dataInclusionFileName(new Date(), producer.name, 'services', 'json', suffix)}`,
    JSON.stringify(toSchemaServicesDataInclusion(lieuxDeMediationNumerique), noEmptyCell),
    throwWriteFileError
  );
};
