import { Nom } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';

export const processNom = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Nom =>
  Nom(source[matching.nom.colonne]?.toString() ?? '');
