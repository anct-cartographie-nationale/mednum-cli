import { fileNameDate, formatForFileName } from '../../file-system';

export const mediationNumeriqueFileName = (
  date: Date,
  idProducteur: string,
  territoire: string,
  extension: 'csv' | 'json',
  suffix?: string
): string =>
  `${fileNameDate(date)}-${formatForFileName(idProducteur)}-lieux-de-mediation-numeriques-${formatForFileName(territoire)}${
    suffix == null ? '' : `-${suffix}`
  }.${extension}`;
