import type { EtablissementALAdresse } from '../../../../../libraries/annuaire-entreprises';
import { tokenSetSimilarityRatio } from '../../../../../libraries/text';

export type AnnuaireIndex = Map<string, EtablissementALAdresse[]>;

const SIMILARITE_DE_DENOMINATION_MINIMALE = 80;

const MOTS_VIDES: string[] = ['de', 'du', 'des', 'la', 'le', 'les', 'et', 'en', 'aux', 'au', 'sur', 'sous'];

const LIGATURES = /[œŒæÆ]/gu;

const REMPLACEMENTS: Record<string, string> = { œ: 'oe', Œ: 'oe', æ: 'ae', Æ: 'ae' };

const normaliser = (valeur: string): string =>
  (valeur ?? '')
    .replace(LIGATURES, (ligature: string): string => REMPLACEMENTS[ligature] ?? ligature)
    .normalize('NFD')
    .replace(/[̀-ͯ]/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, ' ')
    .trim();

const motsDe = (valeur: string): string[] =>
  normaliser(valeur)
    .split(' ')
    .filter((mot: string): boolean => mot.length > 2 && !MOTS_VIDES.includes(mot));

const sansLaCommune = (valeur: string, commune: string): string => {
  const toponyme: string[] = motsDe(commune);

  return motsDe(valeur)
    .filter((mot: string): boolean => !toponyme.includes(mot))
    .join(' ');
};

export const denominationConcorde = (nom: string, commune: string, denomination: string): boolean => {
  const gauche: string = sansLaCommune(nom, commune);
  const droite: string = sansLaCommune(denomination, commune);

  return gauche !== '' && droite !== '' && tokenSetSimilarityRatio(gauche, droite) >= SIMILARITE_DE_DENOMINATION_MINIMALE;
};

export const etablissementDuLieu = (
  annuaire: AnnuaireIndex,
  cle: string,
  nom: string,
  commune: string
): EtablissementALAdresse | undefined =>
  (annuaire.get(cle) ?? [])
    .filter((etablissement: EtablissementALAdresse): boolean => etablissement.actif)
    .filter((etablissement: EtablissementALAdresse): boolean => denominationConcorde(nom, commune, etablissement.denomination))
    .sort((gauche: EtablissementALAdresse, droite: EtablissementALAdresse): number => {
      const ecart: number =
        tokenSetSimilarityRatio(sansLaCommune(nom, commune), sansLaCommune(droite.denomination, commune)) -
        tokenSetSimilarityRatio(sansLaCommune(nom, commune), sansLaCommune(gauche.denomination, commune));

      return ecart === 0 ? gauche.siret.localeCompare(droite.siret) : ecart;
    })[0];
