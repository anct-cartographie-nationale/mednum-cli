/* eslint-disable @typescript-eslint/strict-boolean-expressions */

const fileNameDate = (date: Date): string => `${date.toISOString().split('T')[0]?.replace(/-/gu, '')}`;

const formatForFileName = (fileName: string): string =>
  fileName
    .toLowerCase()
    .replace(/\s/gu, '-')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/gu, '')
    .replace(/'+/gu, '-');

export const mediationNumeriqueFileName = (
  date: Date,
  idProducteur: string,
  territoire: string,
  extension: 'csv' | 'json',
  report?: boolean | undefined
): string =>
  `${fileNameDate(date)}-${formatForFileName(idProducteur)}-lieux-de-mediation-numeriques-${formatForFileName(territoire)}${
    report ? '-reports' : ''
  }.${extension}`;

export const dataInclusionFileName = (
  date: Date,
  idProducteur: string,
  schema: 'services' | 'structures',
  extension: 'csv' | 'json'
): string => `${schema}-inclusion-${fileNameDate(date)}-${formatForFileName(idProducteur)}.${extension}`;
