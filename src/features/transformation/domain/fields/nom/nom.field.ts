import { appliquerRegles, nettoyerNom, Nom } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { LieuxMediationNumeriqueMatching, DataSource } from '../../matching';
import { REGLES_NOM_LOCALES } from './clean-operations';

export const processNom = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Nom =>
  Nom(appliquerRegles(REGLES_NOM_LOCALES, nettoyerNom(source[matching.nom.colonne]?.toString() ?? '')));
