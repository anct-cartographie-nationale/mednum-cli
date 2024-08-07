import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';

const sourceIfAny = (source: DataSource, sourceName: string, colonne?: string): string =>
  colonne == null || source[colonne] == null || source[colonne]?.toString() === ''
    ? sourceName
    : source[colonne]?.toString() ?? sourceName;

export const processSource = (source: DataSource, matching: LieuxMediationNumeriqueMatching, sourceName: string): string =>
  sourceIfAny(source, sourceName, matching.source?.colonne);
