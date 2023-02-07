import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';

const sourceIfAny = (source: DataSource, sourceName: string, colonne?: string): string =>
  colonne == null || source[colonne] === undefined || source[colonne] == null ? sourceName : source[colonne] ?? '';

export const processSource = (source: DataSource, matching: LieuxMediationNumeriqueMatching, sourceName: string): string =>
  sourceIfAny(source, sourceName, matching.source.colonne);
