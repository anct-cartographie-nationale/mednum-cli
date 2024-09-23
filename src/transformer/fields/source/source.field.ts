import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';

const sourceIfAny = (source: DataSource, sourceName: string, colonne?: string): string =>
  colonne == null || source[colonne] == null || (source[colonne] as string) === '' ? sourceName : (source[colonne] as string);

export const processSource = (source: DataSource, matching: LieuxMediationNumeriqueMatching, sourceName: string): string =>
  sourceIfAny(source, sourceName, matching.source?.colonne);
