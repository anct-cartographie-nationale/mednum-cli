import { LieuxMediationNumeriqueMatching, Source } from '../../input';

export const processNom = (source: Source, matching: LieuxMediationNumeriqueMatching): string =>
  source[matching.nom.colonne] ?? '';
