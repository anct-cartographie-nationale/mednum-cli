import type { Typologies } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { tokenSetSimilarityRatio } from '../../../../../libraries/text';
import type { AccesLibreErp } from '../../../../../libraries/acces-libre';

export type ActivitesAttendues = {
  propres: string[];
  secondaires?: string[];
};

export const ACTIVITES_PAR_TYPOLOGIE: Record<string, ActivitesAttendues> = {
  RFS: {
    propres: ['Guichet france services', 'Maison de services au public'],
    secondaires: ['Point accueil numerique', 'Centre culturel', 'Bibliothèque médiathèque']
  },
  MSAP: { propres: ['Maison de services au public', 'Guichet france services'] },
  BIB: { propres: ['Bibliothèque médiathèque'], secondaires: ['Centre culturel'] },
  MUNI: { propres: ['Mairie'] },
  LA_POSTE: { propres: ['Bureau de poste'] },
  ASSO: { propres: ['Association'] },
  CS: { propres: ['Centre social'], secondaires: ['Association'] },
  EVS: { propres: ['Centre social'], secondaires: ['Association'] },
  CSC: { propres: ['Centre social'], secondaires: ['Centre culturel', 'Association'] },
  MQ: { propres: ['Centre social'], secondaires: ['Centre culturel'] },
  MJC: { propres: ['Centre culturel'] },
  FT: { propres: ['Emploi, formation'] },
  MDE: { propres: ['Emploi, formation'] },
  CAP_EMPLOI: { propres: ['Emploi, formation'] },
  ML: { propres: ['Emploi, formation', "Mission locale pour l'insertion professionnelle et sociale des jeunes"] },
  OF: { propres: ['Institut de formation, de recherche'] },
  CFP: { propres: ['Centre des finances publiques'] },
  CPAM: { propres: ['Sécurité sociale, mutuelle santé'] },
  MSA: { propres: ['Sécurité sociale, mutuelle santé', 'Guichet france services'] },
  CAF: { propres: ["Caisse d'allocations familiales (caf)"] },
  CCAS: { propres: ['Administration publique'] },
  CIAS: { propres: ['Administration publique'] },
  CMS: { propres: ['Administration publique'] },
  PREF: { propres: ['Administration publique'] },
  CC: { propres: ['Collectivité territoriale'] },
  CD: { propres: ['Collectivité territoriale'] },
  ENM: { propres: ['Collectivité territoriale'] },
  REG: { propres: ['Administration publique', 'Collectivité territoriale'] },
  DEPT: { propres: ['Collectivité territoriale', 'Administration publique'] },
  MDS: {
    propres: ["Point d'information local dédié aux personnes âgées", 'Centre de protection maternelle et infantile (pmi)']
  },
  PIJ_BIJ: { propres: ['Point information jeunesse'] },
  PI: { propres: ['Point information jeunesse'] },
  PIMMS: { propres: ['Point conseil budget'], secondaires: ['Association'] },
  CIDFF: { propres: ["Centre d'information sur les droits des femmes et des familles"], secondaires: ['Association'] },
  PAD: { propres: ['Point justice'] },
  EPN: { propres: ['Point accueil numerique'], secondaires: ['Bibliothèque médiathèque'] },
  TIERS_LIEUX: { propres: ['Coworking', 'Espace collaboratif'] },
  FABLAB: { propres: ['Coworking', 'Espace collaboratif'], secondaires: ['Bibliothèque médiathèque'] },
  UDAF: { propres: ['Association'] },
  ACI: { propres: ['Association'] },
  RESSOURCERIE: { propres: ['Association'] },
  EI: { propres: ['Association'], secondaires: ['Coworking'] }
};

export const ACTIVITES_HEBERGEANTES: string[] = [
  'Mairie',
  'Bureau de poste',
  'Collectivité territoriale',
  'Administration publique',
  'Point justice'
];

const ACTIVITE_PROPRE = 1;

const NOM_CONCORDANT = 2;

const ACTIVITE_SECONDAIRE = 3;

const HEBERGEMENT = 4;

const AUCUNE_PREUVE = Number.POSITIVE_INFINITY;

const SIMILARITE_DU_NOM_MINIMALE = 80;

const NOM_DISTINCTIF_MINIMAL = 70;

const MARGE_DE_NOM_SUFFISANTE = 25;

const FICHES_EN_DOUBLON_MINIMALE = 70;

const activites = (typologies: Typologies | undefined, rang: keyof ActivitesAttendues): Set<string> =>
  new Set((typologies ?? []).flatMap((typologie: string): string[] => ACTIVITES_PAR_TYPOLOGIE[typologie]?.[rang] ?? []));

const niveauDePreuve = (nom: string, typologies: Typologies | undefined, erp: AccesLibreErp): number => {
  const propres: Set<string> = activites(typologies, 'propres');
  const secondaires: Set<string> = activites(typologies, 'secondaires');

  if (propres.has(erp.activite)) return ACTIVITE_PROPRE;
  if (tokenSetSimilarityRatio(nom, erp.nom) >= SIMILARITE_DU_NOM_MINIMALE) return NOM_CONCORDANT;
  if (secondaires.has(erp.activite)) return ACTIVITE_SECONDAIRE;
  if (propres.size + secondaires.size > 0 && ACTIVITES_HEBERGEANTES.includes(erp.activite)) return HEBERGEMENT;

  return AUCUNE_PREUVE;
};

export const estAttribuee = (nom: string, typologies: Typologies | undefined, erp: AccesLibreErp): boolean =>
  niveauDePreuve(nom, typologies, erp) !== AUCUNE_PREUVE;

const parNom = (nom: string, candidats: AccesLibreErp[]): [AccesLibreErp, number][] =>
  candidats
    .map((erp: AccesLibreErp): [AccesLibreErp, number] => [erp, tokenSetSimilarityRatio(nom, erp.nom)])
    .sort((gauche, droite): number => droite[1] - gauche[1]);

const seDetache = (classes: [AccesLibreErp, number][]): AccesLibreErp | undefined =>
  (classes[0]?.[1] ?? 0) >= NOM_DISTINCTIF_MINIMAL && (classes[0]?.[1] ?? 0) - (classes[1]?.[1] ?? 0) >= MARGE_DE_NOM_SUFFISANTE
    ? classes[0]?.[0]
    : undefined;

const sontEnDoublon = (candidats: AccesLibreErp[]): boolean =>
  candidats.every((un: AccesLibreErp, index: number): boolean =>
    candidats
      .slice(index + 1)
      .every((autre: AccesLibreErp): boolean => tokenSetSimilarityRatio(un.nom, autre.nom) >= FICHES_EN_DOUBLON_MINIMALE)
  );

const laPremiere = (candidats: AccesLibreErp[]): AccesLibreErp | undefined =>
  [...candidats].sort((gauche, droite): number => gauche.ficheUrl.localeCompare(droite.ficheUrl))[0];

const mieuxProuvees = (nom: string, typologies: Typologies | undefined, candidats: AccesLibreErp[]): AccesLibreErp[] => {
  const niveaux: number[] = candidats.map((erp: AccesLibreErp): number => niveauDePreuve(nom, typologies, erp));
  const meilleur: number = Math.min(...niveaux);

  return candidats.filter((_: AccesLibreErp, index: number): boolean => niveaux[index] === meilleur);
};

export const ficheAttribuee = (
  nom: string,
  typologies: Typologies | undefined,
  candidats: AccesLibreErp[]
): AccesLibreErp | undefined => {
  const prouvees: AccesLibreErp[] = candidats.filter((erp: AccesLibreErp): boolean => estAttribuee(nom, typologies, erp));

  if (prouvees.length <= 1) return prouvees[0];

  const tete: AccesLibreErp[] = mieuxProuvees(nom, typologies, prouvees);

  if (tete.length === 1) return tete[0];

  return seDetache(parNom(nom, tete)) ?? (sontEnDoublon(tete) ? laPremiere(tete) : undefined);
};
