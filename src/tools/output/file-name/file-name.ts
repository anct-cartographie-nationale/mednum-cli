const fileNameDate = (date: Date): string => `${date.toISOString().split('T')[0]?.replace(/-/gu, '')}`;

export const mediationNumeriqueFileName = (
  date: Date,
  idProducteur: string,
  territoire: string,
  extension: 'csv' | 'json'
): string => `${fileNameDate(date)}_${idProducteur}_lieux-de-mediation-numeriques-${territoire}.${extension}`;

export const dataInclusionFileName = (
  date: Date,
  idProducteur: string,
  schema: 'services' | 'structures',
  extension: 'csv' | 'json'
): string => `${schema}-inclusion-${fileNameDate(date)}_${idProducteur}.${extension}`;
