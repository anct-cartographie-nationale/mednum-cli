export type ErrorOutput = {
  index: number;
  field: number | string | symbol;
  message: string;
  entryName: string;
  valeurDorigine?: string;
  valeurRetenue?: string;
};

const HEADERS: (keyof ErrorOutput)[] = ['index', 'field', 'message', 'entryName', 'valeurDorigine', 'valeurRetenue'];

const toDoubleQuoted = (header?: string): string => (header == null ? '' : `"${header}"`);

const fieldsArrayFrom = (listError: ErrorOutput): string[] => [
  listError.index.toString(),
  listError.field.toString(),
  listError.message,
  listError.entryName,
  listError.valeurDorigine ?? '',
  listError.valeurRetenue ?? ''
];

export const csvLineFrom = (cells: string[]): string => cells.map(toDoubleQuoted).join(',');

const toReportErrorsCsvLine = (listError: ErrorOutput): string => csvLineFrom(fieldsArrayFrom(listError));

export const errorReportToCsv = (listErrors: ErrorOutput[]): string =>
  `${csvLineFrom(HEADERS)}\n${listErrors.map(toReportErrorsCsvLine).join('\n')}`;
