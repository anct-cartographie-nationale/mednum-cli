/* eslint-disable @typescript-eslint/no-restricted-imports */

import * as fs from 'fs';
import {
  LieuMediationNumerique,
  SchemaLieuMediationNumerique,
  toSchemaLieuxDeMediationNumerique,
  toSchemaServicesDataInclusion,
  toSchemaStructuresDataInclusion
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { dataInclusionFileName, mediationNumeriqueFileName } from './file-name/file-name';
import { toLieuxMediationNumeriqueCsv } from './to-lieux-mediation-numerique-csv/to-lieux-mediation-numerique-csv';

export type Output = {
  path: string;
  name: string;
  territoire: string;
};

const throwWriteFileError = (writeFileError: unknown): void => {
  if (writeFileError instanceof Error) {
    throw writeFileError;
  }
};

const createFolderIfNotExist = (folderPath: string): string => {
  !fs.existsSync(folderPath) && fs.mkdirSync(folderPath, { recursive: true });

  return folderPath;
};

const noEmptyCell = <T>(_: string, cell: T): T | undefined => (cell === '' ? undefined : cell);

const writeMediationNumeriqueJsonOutput = (
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

const writeMediationNumeriqueCsvOutput = (
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
    toLieuxMediationNumeriqueCsv(schemaLieuxDeMediationNumerique),
    throwWriteFileError
  );
};

const writeStructuresDataInclusionJsonOutput = (
  producer: Output,
  lieuxDeMediationNumerique: LieuMediationNumerique[]
): void => {
  fs.writeFile(
    `${createFolderIfNotExist(producer.path)}/${dataInclusionFileName(new Date(), producer.name, 'structures', 'json')}`,
    JSON.stringify(toSchemaStructuresDataInclusion(lieuxDeMediationNumerique), noEmptyCell),
    throwWriteFileError
  );
};

const writeServicesDataInclusionJsonOutput = (producer: Output, lieuxDeMediationNumerique: LieuMediationNumerique[]): void => {
  fs.writeFile(
    `${createFolderIfNotExist(producer.path)}/${dataInclusionFileName(new Date(), producer.name, 'services', 'json')}`,
    JSON.stringify(toSchemaServicesDataInclusion(lieuxDeMediationNumerique), noEmptyCell),
    throwWriteFileError
  );
};

export const writeOutputFiles =
  (producer: Output) =>
  (lieuxDeMediationNumerique: LieuMediationNumerique[]): void => {
    const schemaLieuxDeMediationNumerique: SchemaLieuMediationNumerique[] =
      toSchemaLieuxDeMediationNumerique(lieuxDeMediationNumerique);

    writeMediationNumeriqueJsonOutput(producer, schemaLieuxDeMediationNumerique);
    writeMediationNumeriqueCsvOutput(producer, schemaLieuxDeMediationNumerique);
    writeStructuresDataInclusionJsonOutput(producer, lieuxDeMediationNumerique);
    writeServicesDataInclusionJsonOutput(producer, lieuxDeMediationNumerique);
  };
