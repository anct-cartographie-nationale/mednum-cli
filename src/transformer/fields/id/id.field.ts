import { Id } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';

export const processId = (source: DataSource, matching: LieuxMediationNumeriqueMatching, index: number): Id =>
  Id(
    (matching.id == null || source[matching.id.colonne] == '' ? index.toString() : source[matching.id.colonne]) ??
      index.toString()
  );
