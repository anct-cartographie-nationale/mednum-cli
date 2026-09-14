export const fileNameDate = (date: Date): string => `${date.toISOString().split('T')[0]?.replace(/-/gu, '')}`;

export const formatForFileName = (fileName: string): string =>
  fileName
    .toLowerCase()
    .replace(/\s/gu, '-')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/gu, '')
    .replace(/'+/gu, '-');
