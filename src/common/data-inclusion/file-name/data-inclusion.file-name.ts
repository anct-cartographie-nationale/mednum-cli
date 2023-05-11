import { fileNameDate, formatForFileName } from '../../output-file';

export const dataInclusionFileName = (
  date: Date,
  idProducteur: string,
  schema: 'services' | 'structures',
  extension: 'csv' | 'json'
): string => `${schema}-inclusion-${fileNameDate(date)}-${formatForFileName(idProducteur)}.${extension}`;
