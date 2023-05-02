import { Pivot } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';

export const processPivot = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Pivot =>
  matching.pivot?.colonne == null || source[matching.pivot.colonne] === ''
    ? Pivot('00000000000000')
    : Pivot(source[matching.pivot.colonne] ?? '00000000000000');
