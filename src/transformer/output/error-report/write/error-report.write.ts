import * as fs from 'fs';
import {
  createFolderIfNotExist,
  mediationNumeriqueFileName,
  noEmptyCell,
  Output,
  throwWriteFileError
} from '../../../../common';
import { Record, Report } from '../../../report';
import { ErrorOutput, errorReportToCsv } from '../to-csv/error-report.to-csv';

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

    writeReportErrorsJsonOutput(producer, listErrors);
    writeReportErrorsCsvOutput(producer, listErrors);
  };
