import { Pivot } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';

export const processPivot = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Pivot => {
  try {
    const colonne = matching.pivot?.colonne ?? '';
    return Pivot(source[colonne] ?? '00000000000000');
  } catch {
    return Pivot('00000000000000');
  }
}
