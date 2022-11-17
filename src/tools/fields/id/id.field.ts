import { LieuxMediationNumeriqueMatching, Source } from '../../input';

export const processId = (source: Source, matching: LieuxMediationNumeriqueMatching, index: number): string =>
  (matching.id == null ? index.toString() : source[matching.id.colonne]) ?? index.toString();
