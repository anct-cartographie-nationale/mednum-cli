import { fileNameDate, formatForFileName } from '../../output-file';

export const mediationNumeriqueFileName = (
  date: Date,
  idProducteur: string,
  territoire: string,
  extension: 'csv' | 'json',
  report?: boolean | undefined
): string =>
  `${fileNameDate(date)}-${formatForFileName(idProducteur)}-lieux-de-mediation-numeriques-${formatForFileName(territoire)}${
    report == null ? '' : '-reports'
  }.${extension}`;
