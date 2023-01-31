import { Pivot } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';

export const processPivot = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Pivot => {
  if (matching.pivot?.colonne == null) return Pivot('00000000000000');
  if (matching.pivot?.colonne != null)
    try {
      return Pivot(source[matching.pivot.colonne] ?? '00000000000000');
    } catch {
      return Pivot('00000000000000');
    }
  else {
    return Pivot(source[matching.pivot.colonne] ?? '00000000000000');
  }
};
