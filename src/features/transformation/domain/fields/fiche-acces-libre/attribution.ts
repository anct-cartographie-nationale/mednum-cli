import type { Typologies } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { tokenSetSimilarityRatio } from '../../../../../libraries/text';
import type { AccesLibreErp } from '../../../../../libraries/acces-libre';

export const ACTIVITES_PAR_TYPOLOGIE: Record<string, string[]> = {
  RFS: ['Guichet france services', 'Maison de services au public'],
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
  FABLAB: ['Coworking', 'Espace collaboratif', 'Bibliothèque médiathèque']
};

export const ACTIVITES_HEBERGEANTES: string[] = [
  'Mairie',
  'Bureau de poste',
  'Collectivité territoriale',
  'Administration publique',
  'Point justice'
];

const SIMILARITE_DU_NOM_MINIMALE = 80;

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
