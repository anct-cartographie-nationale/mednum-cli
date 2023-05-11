/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import * as fs from 'fs';
import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { createFolderIfNotExist, noEmptyCell, Output, throwWriteFileError } from '../../output-file';
import { mediationNumeriqueFileName } from '../file-name/mediation-numerique.file-name';
import { mediationNumeriqueToCsv } from '../to-csv/mediation-numerique.to-csv';

export const writeMediationNumeriqueJsonOutput = (
  producer: Output,
  schemaLieuxDeMediationNumerique: SchemaLieuMediationNumerique[]
): void => {
  fs.writeFile(
    `${createFolderIfNotExist(producer.path)}/${mediationNumeriqueFileName(
      new Date(),
      producer.name,
      producer.territoire,
      'json'
    )}`,
    JSON.stringify(schemaLieuxDeMediationNumerique, noEmptyCell),
    throwWriteFileError
  );
};

export const writeMediationNumeriqueCsvOutput = (
  producer: Output,
  schemaLieuxDeMediationNumerique: SchemaLieuMediationNumerique[]
): void => {
  fs.writeFile(
    `${createFolderIfNotExist(producer.path)}/${mediationNumeriqueFileName(
      new Date(),
      producer.name,
      producer.territoire,
      'csv'
    )}`,
    mediationNumeriqueToCsv(schemaLieuxDeMediationNumerique),
    throwWriteFileError
  );
};
