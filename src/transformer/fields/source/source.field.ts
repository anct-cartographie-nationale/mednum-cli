import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';

export const processSource = (
  source: DataSource,
  matching: LieuxMediationNumeriqueMatching,
  sourceName: string
): string | undefined => (source[matching.source?.colonne] === '' ? sourceName : source[matching.source?.colonne]);
