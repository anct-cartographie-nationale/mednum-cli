import { Url } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, DataSource, Colonne } from '../../input';

const canProcessAccessibilite = (source: DataSource, accessibilite?: Colonne): accessibilite is Colonne =>
  accessibilite?.colonne != null && source[accessibilite.colonne] != null && source[accessibilite.colonne] !== '';

export const processAccessibilite = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Url | undefined =>
  canProcessAccessibilite(source, matching.accessibilite) ? Url(source[matching.accessibilite.colonne] ?? '') : undefined;
