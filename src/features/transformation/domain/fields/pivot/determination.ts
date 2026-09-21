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

const ENTITES_HEBERGEES: RegExp[] = [
  /^amicale\b/u,
  /^comite (?:des? |d |de la )?fetes?\b/u,
  /^(?:cse|comite (?:social et economique|d entreprise|d etablissement))\b/u,
  /(?:oeuvres sociales|du personnel|des personnels)\b/u,
  /^caisse (?:des? )?ecoles\b/u,
  /^(?:ape|apel|association (?:des )?parents)\b/u,
  /^(?:association sportive|usep|unss|union sportive)\b/u,
  /^(?:fse|foyer socio|cooperative scolaire)\b/u,
  /^(?:soc |societe )?mutualiste\b/u,
  /^(?:union immobiliere|sci)\b/u,
  /^office (?:de |du )?tourisme\b/u
];

const estHebergeeChezSonHote = (nom: string, denomination: string): boolean => {
  const hote: string = normaliser(nom);
  const candidate: string = normaliser(denomination);

  return ENTITES_HEBERGEES.some((motif: RegExp): boolean => motif.test(candidate) && !motif.test(hote));
};

const sansLaCommune = (valeur: string, commune: string): string => {
  const toponyme: string[] = motsDe(commune);

  return motsDe(valeur)
    .filter((mot: string): boolean => !toponyme.includes(mot))
    .join(' ');
};

export const denominationConcorde = (nom: string, commune: string, denomination: string): boolean => {
  const gauche: string = sansLaCommune(nom, commune);
  const droite: string = sansLaCommune(denomination, commune);

  return (
    !estHebergeeChezSonHote(nom, denomination) &&
    gauche !== '' &&
    droite !== '' &&
    tokenSetSimilarityRatio(gauche, droite) >= SIMILARITE_DE_DENOMINATION_MINIMALE
  );
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
