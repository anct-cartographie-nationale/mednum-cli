/* eslint-disable @typescript-eslint/no-restricted-imports, max-lines */

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
import { generatePublishMetadata } from './publish-metadata/publish-metadata';
import { Record, Report } from '../report';
import { toReportErrorsCsv } from './to-report-errors-csv/to-report-errors-csv';

export type Output = {
  path: string;
  name: string;
  territoire: string;
};

export type ErrorOutput = {
  index: number;
  field: number | string | symbol;
  message: string;
  entryName: string;
};

const throwWriteFileError = (writeFileError: unknown): void => {
  if (writeFileError instanceof Error) {
    throw writeFileError;
  }
};

export const createFolderIfNotExist = (folderPath: string): string => {
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

const writeReportErrorsCsvOutput = (producer: Output, listErrors: ErrorOutput[], report: boolean): void => {
  fs.writeFile(
    `${createFolderIfNotExist(producer.path)}/${mediationNumeriqueFileName(
      new Date(),
      producer.name,
      producer.territoire,
      'csv',
      report
    )}`,
    toReportErrorsCsv(listErrors),
    throwWriteFileError
  );
};

const writeReportErrorsJsonOutput = (producer: Output, listErrors: ErrorOutput[], report: boolean): void => {
  fs.writeFile(
    `${createFolderIfNotExist(producer.path)}/${mediationNumeriqueFileName(
      new Date(),
      producer.name,
      producer.territoire,
      'json',
      report
    )}`,
    JSON.stringify(listErrors, noEmptyCell),
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

const writePublierMetadataOutput = (producer: Output, lieuxDeMediationNumerique: LieuMediationNumerique[]): void => {
  fs.writeFile(
    `${createFolderIfNotExist(producer.path)}/publier.json`,
    JSON.stringify(generatePublishMetadata(producer, lieuxDeMediationNumerique, new Date())),
    throwWriteFileError
  );
};

export const writeErrorsOutputFiles =
  (producer: Output) =>
  (reports: Report): void => {
    const report: boolean = true;
    const listErrors: ErrorOutput[] = [];

    reports.records().forEach((reportEntry: Record): void => {
      const typedError: ErrorOutput = {
        index: reportEntry.index,
        field: reportEntry.errors[0] === undefined ? '' : reportEntry.errors[0].field,
        message: reportEntry.errors[0] === undefined ? '' : reportEntry.errors[0].message,
        entryName: reportEntry.errors[0] === undefined ? '' : reportEntry.errors[0].entryName
      };
      listErrors.push(typedError);
    });

    writeReportErrorsJsonOutput(producer, listErrors, report);
    writeReportErrorsCsvOutput(producer, listErrors, report);
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
    writePublierMetadataOutput(producer, lieuxDeMediationNumerique);
  };
