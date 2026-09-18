import type { Typologies } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { tokenSetSimilarityRatio } from '../../../../../libraries/text';
import type { AccesLibreErp } from '../../../../../libraries/acces-libre';

export const ACTIVITES_PAR_TYPOLOGIE: Record<string, string[]> = {
  RFS: [
    'Guichet france services',
    'Maison de services au public',
    'Point accueil numerique',
    'Centre culturel',
    'Bibliothèque médiathèque'
  ],
  MSAP: ['Maison de services au public', 'Guichet france services'],
  BIB: ['Bibliothèque médiathèque', 'Centre culturel'],
  MUNI: ['Mairie'],
  LA_POSTE: ['Bureau de poste'],
  ASSO: ['Association'],
  CS: ['Centre social', 'Association'],
  EVS: ['Centre social', 'Association'],
  MQ: ['Centre social', 'Centre culturel'],
  MJC: ['Centre culturel'],
  FT: ['Emploi, formation'],
  ML: ['Emploi, formation', "Mission locale pour l'insertion professionnelle et sociale des jeunes"],
  OF: ['Institut de formation, de recherche'],
  CFP: ['Centre des finances publiques'],
  CPAM: ['Sécurité sociale, mutuelle santé'],
  CAF: ["Caisse d'allocations familiales (caf)"],
  CCAS: ['Administration publique'],
  PREF: ['Administration publique'],
  CC: ['Collectivité territoriale'],
  CD: ['Collectivité territoriale'],
  ENM: ['Collectivité territoriale'],
  MDS: ["Point d'information local dédié aux personnes âgées", 'Centre de protection maternelle et infantile (pmi)'],
  PIJ_BIJ: ['Point information jeunesse'],
  PIMMS: ['Point conseil budget', 'Association'],
  EPN: ['Point accueil numerique', 'Bibliothèque médiathèque'],
  TIERS_LIEUX: ['Coworking', 'Espace collaboratif'],
  FABLAB: ['Coworking', 'Espace collaboratif', 'Bibliothèque médiathèque'],
  CSC: ['Centre social', 'Centre culturel', 'Association'],
  MSA: ['Sécurité sociale, mutuelle santé', 'Guichet france services'],
  MDE: ['Emploi, formation'],
  CAP_EMPLOI: ['Emploi, formation'],
  PI: ['Point information jeunesse'],
  CIDFF: ["Centre d'information sur les droits des femmes et des familles", 'Association'],
  CIAS: ['Administration publique'],
  CMS: ['Administration publique'],
  REG: ['Administration publique', 'Collectivité territoriale'],
  DEPT: ['Collectivité territoriale', 'Administration publique'],
  UDAF: ['Association'],
  ACI: ['Association'],
  EI: ['Association', 'Coworking'],
  RESSOURCERIE: ['Association'],
  PAD: ['Point justice']
};

export const ACTIVITES_HEBERGEANTES: string[] = [
  'Mairie',
  'Bureau de poste',
  'Collectivité territoriale',
  'Administration publique',
  'Point justice'
];

const SIMILARITE_DU_NOM_MINIMALE = 80;

const NOM_DISTINCTIF_MINIMAL = 70;

const MARGE_DE_NOM_SUFFISANTE = 25;

const FICHES_EN_DOUBLON_MINIMALE = 70;

const activitesAttendues = (typologies?: Typologies): Set<string> =>
  new Set((typologies ?? []).flatMap((typologie: string): string[] => ACTIVITES_PAR_TYPOLOGIE[typologie] ?? []));

export const estAttribuee = (nom: string, typologies: Typologies | undefined, erp: AccesLibreErp): boolean => {
  const attendues: Set<string> = activitesAttendues(typologies);

  return (
    attendues.has(erp.activite) ||
    tokenSetSimilarityRatio(nom, erp.nom) >= SIMILARITE_DU_NOM_MINIMALE ||
    (attendues.size > 0 && ACTIVITES_HEBERGEANTES.includes(erp.activite))
  );
};

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

export const ficheAttribuee = (
  nom: string,
  typologies: Typologies | undefined,
  candidats: AccesLibreErp[]
): AccesLibreErp | undefined => {
  const attribuees: AccesLibreErp[] = candidats.filter((erp: AccesLibreErp): boolean => estAttribuee(nom, typologies, erp));

  if (attribuees.length <= 1) return attribuees[0];

  return seDetache(parNom(nom, attribuees)) ?? (sontEnDoublon(attribuees) ? laPremiere(attribuees) : undefined);
};
