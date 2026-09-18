import * as fs from 'node:fs';
import { createFolderIfNotExist, noEmptyCell, type Output, throwWriteFileError } from '../../../libraries/file-system';
import { mediationNumeriqueFileName } from '../../../libraries/mediation-numerique';
import type { Record, Report } from '../domain';
import { type ErrorOutput, errorReportToCsv } from '../domain';

const writeReportErrorsCsvOutput = (producer: Output, listErrors: ErrorOutput[]): void => {
  fs.writeFile(
    `${createFolderIfNotExist(producer.path)}/${mediationNumeriqueFileName(
      new Date(),
      producer.name,
      producer.territoire,
      'csv',
      'report'
    )}`,
    errorReportToCsv(listErrors),
    throwWriteFileError
  );
};

const writeReportErrorsJsonOutput = (producer: Output, listErrors: ErrorOutput[]): void => {
  fs.writeFile(
    `${createFolderIfNotExist(producer.path)}/${mediationNumeriqueFileName(
      new Date(),
      producer.name,
      producer.territoire,
      'json',
      'report'
    )}`,
    JSON.stringify(listErrors, noEmptyCell),
    throwWriteFileError
  );
};

export const writeErrorsOutputFiles =
  (producer: Output) =>
  (reports: Report): void => {
    const listErrors: ErrorOutput[] = reports.records().flatMap((reportEntry: Record): ErrorOutput[] =>
      reportEntry.errors.map(
        (erreur): ErrorOutput => ({
          index: reportEntry.index,
          field: erreur.field,
          message: erreur.message,
          entryName: erreur.entryName,
          ...(erreur.fixes[0] == null
            ? {}
            : { valeurDorigine: erreur.fixes[0].before, valeurRetenue: erreur.fixes[0].after ?? '' })
        })
      )
    );

    writeReportErrorsJsonOutput(producer, listErrors);
    writeReportErrorsCsvOutput(producer, listErrors);
  };
