import { fileNameDate, formatForFileName } from '../../output-file';

export const dataInclusionFileName = (
  date: Date,
  idProducteur: string,
  schema: 'services' | 'structures',
  extension: 'csv' | 'json',
  suffix?: string
): string =>
  `${schema}-inclusion-${fileNameDate(date)}-${formatForFileName(idProducteur)}${
    suffix == null ? '' : `-${suffix}`
  }.${extension}`;
