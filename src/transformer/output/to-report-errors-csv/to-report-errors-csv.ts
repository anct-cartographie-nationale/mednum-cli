import { ErrorOutput } from '../write-output-files';

const HEADERS: (keyof ErrorOutput)[] = ['index', 'field', 'message', 'entryName'];

const toDoubleQuoted = (header?: string): string => (header == null ? '' : `"${header}"`);

const fieldsArrayFrom = (listError: ErrorOutput): string[] => [
  listError.index.toString(),
  listError.field.toString(),
  listError.message,
  listError.entryName
];

export const csvLineFrom = (cells: string[]): string => cells.map(toDoubleQuoted).join(',');

const toReportErrorsCsvLine = (listError: ErrorOutput): string => csvLineFrom(fieldsArrayFrom(listError));

export const toReportErrorsCsv = (listErrors: ErrorOutput[]): string =>
  `${csvLineFrom(HEADERS)}\n${listErrors.map(toReportErrorsCsvLine).join('\n')}`;
