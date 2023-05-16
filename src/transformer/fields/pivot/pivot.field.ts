import { Pivot } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';

export const processPivot = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Pivot => {
  if (matching.pivot?.colonne == null || source[matching.pivot.colonne] === '') {
    return Pivot('00000000000000');
  } 
    try {
      return Pivot(source[matching.pivot.colonne] ?? '00000000000000');
    } catch (_) {
      return Pivot('00000000000000');
    }
};
