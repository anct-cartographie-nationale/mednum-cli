import type { RegleDeNettoyage } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { Colonne, DataSource, Jonction } from '../../matching';

const REMOVE_INCOMPLETE_ADDRESS_IN_VOIE: RegleDeNettoyage = {
  nom: 'remove incomplete address in voie',
  selecteur:
    /^(C\/O A\.THEVENIER LAFARGE73 AVENUE DU MONT BLANCBAT B|Médiathèque de Champagney Grande rue|Rue|1 - 3|Residence les 3 C|null|-)\s*$/,
  corriger: (): string => ''
};

export const REGLES_VOIE_LOCALES: readonly RegleDeNettoyage[] = [REMOVE_INCOMPLETE_ADDRESS_IN_VOIE];

const isColonne = (colonneToTest: Partial<Colonne> & Partial<Jonction>): colonneToTest is Colonne =>
  colonneToTest.colonne != null;

export const voieField = (source: DataSource, voie: Jonction & Partial<Colonne>): string => {
  if (isColonne(voie)) return source[voie.colonne]?.toString() ?? '';
  const joined = voie.joindre.colonnes
    .map((colonne: string) => source[colonne])
    .filter(Boolean)
    .join(voie.joindre.séparateur);
  return joined || (voie.joindre.ou ? voieField(source, voie.joindre.ou) : '');
};
