import { Nom } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { LieuxMediationNumeriqueMatching, DataSource } from '../../matching.js';
import { CLEAN_NOM, toCleanField } from './clean-operations.js';

export const processNom = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Nom => {
  const nom = Nom(source[matching.nom.colonne]?.toString() ?? '');
  return Nom(CLEAN_NOM.reduce(toCleanField, nom));
};
