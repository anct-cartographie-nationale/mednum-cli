import { Nom } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, Source } from '../../input';

export const processNom = (source: Source, matching: LieuxMediationNumeriqueMatching): Nom =>
  Nom(source[matching.nom.colonne] ?? '');
