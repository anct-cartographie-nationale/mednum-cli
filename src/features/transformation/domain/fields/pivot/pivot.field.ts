import { Pivot } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { LieuxMediationNumeriqueMatching, DataSource } from '../../matching';

export const processPivot = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Pivot | undefined => {
  const colonne: string = matching.pivot?.colonne ?? '';
  const pivot: string | undefined = source[colonne]?.toString().replace(/[\s.-]/gu, '');

  return pivot == null ? undefined : (Pivot.safe(pivot) ?? undefined);
};
