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

export type Producer = {
  id: string;
  name: string;
  territoire: string;
};

const throwWriteFileError = (writeFileError: unknown): void => {
  if (writeFileError instanceof Error) {
    throw writeFileError;
  }
};

const createFolderIfNotExist = (folderPath: string): string => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  return folderPath;
};

const writeMediationNumeriqueJsonOutput = (
  producer: Producer,
  schemaLieuxDeMediationNumerique: SchemaLieuMediationNumerique[]
): void => {
  fs.writeFile(
    `${createFolderIfNotExist(
      `./assets/output/${producer.name.toLowerCase()}/mediation-numerique`
    )}/${mediationNumeriqueFileName(new Date(), producer.id, producer.territoire, 'json')}`,
    JSON.stringify(schemaLieuxDeMediationNumerique),
    throwWriteFileError
  );
};

const writeMediationNumeriqueCsvOutput = (
  producer: Producer,
  schemaLieuxDeMediationNumerique: SchemaLieuMediationNumerique[]
): void => {
  fs.writeFile(
    `${createFolderIfNotExist(
      `./assets/output/${producer.name.toLowerCase()}/mediation-numerique`
    )}/${mediationNumeriqueFileName(new Date(), producer.id, producer.territoire, 'csv')}`,
    toLieuxMediationNumeriqueCsv(schemaLieuxDeMediationNumerique),
    throwWriteFileError
  );
};

const writeStructuresDataInclusionJsonOutput = (
  producer: Producer,
  lieuxDeMediationNumerique: LieuMediationNumerique[]
): void => {
  fs.writeFile(
    `${createFolderIfNotExist(
      `./assets/output/${producer.name.toLowerCase()}/data-inclusion/strcutures`
    )}/${dataInclusionFileName(new Date(), producer.id, 'structures', 'json')}`,
    JSON.stringify(toSchemaStructuresDataInclusion(lieuxDeMediationNumerique)),
    throwWriteFileError
  );
};

const writeServicesDataInclusionJsonOutput = (
  producer: Producer,
  lieuxDeMediationNumerique: LieuMediationNumerique[]
): void => {
  fs.writeFile(
    `${createFolderIfNotExist(
      `./assets/output/${producer.name.toLowerCase()}/data-inclusion/services`
    )}/${dataInclusionFileName(new Date(), producer.id, 'services', 'json')}`,
    JSON.stringify(toSchemaServicesDataInclusion(lieuxDeMediationNumerique)),
    throwWriteFileError
  );
};

export const writeOutputFiles =
  (producer: Producer) =>
  (lieuxDeMediationNumerique: LieuMediationNumerique[]): void => {
    const schemaLieuxDeMediationNumerique: SchemaLieuMediationNumerique[] =
      toSchemaLieuxDeMediationNumerique(lieuxDeMediationNumerique);

    writeMediationNumeriqueJsonOutput(producer, schemaLieuxDeMediationNumerique);
    writeMediationNumeriqueCsvOutput(producer, schemaLieuxDeMediationNumerique);
    writeStructuresDataInclusionJsonOutput(producer, lieuxDeMediationNumerique);
    writeServicesDataInclusionJsonOutput(producer, lieuxDeMediationNumerique);
  };
