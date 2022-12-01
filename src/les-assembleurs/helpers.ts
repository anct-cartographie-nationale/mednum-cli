/* eslint-disable @typescript-eslint/naming-convention,complexity,id-denylist,@typescript-eslint/no-explicit-any,max-lines-per-function,max-statements  */

export type LesAssembleursItem = {
  'Horaires ouverture': string;
  'horaires lundi': string;
  'horaires mardi': string;
  'horaires mercredi': string;
  'horaires jeudi': string;
  'horaires vendredi': string;
  'horaires samedi': string;
  'horaires dimanche': string;
};

export type LesAssembleursData = LesAssembleursItem[];

const termsToFilter: string[] = [
  'Fermé',
  'FERMÉ',
  'fermée',
  'FERME',
  'fermé',
  'vacance',
  'rendez-vous',
  'rdv',
  'samedi',
  '1er de chaque mois',
  'réservé'
];

/* eslint-disable no-console,@typescript-eslint/no-restricted-imports,no-undef,max-lines-per-function,max-statements,camelcase,complexity,@typescript-eslint/naming-convention,id-denylist,@typescript-eslint/no-explicit-any,no-param-reassign,@typescript-eslint/no-dynamic-delete,max-depth,max-lines */

export type LesAssembleursLieuMediationNumerique = {
  ID: string;
  'Date MAJ': string;
  Nom: string;
  Statut: string;
  EPN: string;
  Nature: string;
  'Horaires ouverture': string;
  'Email contact'?: string;
  Adresse: string;
  'Code postal': number;
  Commune: string;
  Téléphone?: string;
  'Site internet'?: string;
  'Accès équipement': string;
  'Type équipement': string;
  'Conditions accès équipement': string;
  'Coût accès équipement': string;
  'Horaires équipement': string;
  'Médiation numérique': string;
  'Type médiation numérique': string;
  'Conditions accès médiation numérique': string;
  'Accompagnement médiation numérique': string;
  'Coût accès médiation numérique': string;
  'Fréquence médiation numérique': string;
  'Horaires médnum': string;
  Démarches: string;
  'Démarches spécifiques': string;
  'Type démarches': string;
  'Conditions accès démarches': string;
  'Accompagnement démarches': string;
  'Coût accès démarches': string;
  'Fréquence démarches': string;
  'Horaires démarches': string;
  Stockage: string;
  'Coût stockage': string;
  'Vente matériel': string;
  'Type vente matériel': string;
  'Détail publics': string;
  'Détail territoire': string;
  'Accessibilité PMR': string;
  'Accès transports en commun': string;
  APTIC: string;
  Latitude: string;
  Longitude: string;
  'horaires lundi': string;
  'horaires mardi': string;
  'horaires mercredi': string;
  'horaires jeudi': string;
  'horaires vendredi': string;
  'horaires samedi': string;
  'horaires dimanche': string;
  itinérance: string;
  'France Services': string;
  Département: string;
  Arrondissement: string;
  EPCI: string;
};

export const objectKeyFormatter = (str: string): string =>
  objectKeyRemovePonctuation(str).replace(/ /gu, '_').toLocaleLowerCase();

const objectKeyRemovePonctuation = (str: string): string => str.normalize('NFD').replace(/[\u0300-\u036f]/gu, '');

const isIncludedIn =
  (openingHours: string) =>
  (shouldFilter: boolean, termToFilter: string): boolean =>
    shouldFilter || openingHours.includes(termToFilter);

const isEmpty = (openingHours: string): boolean => ['-----', '-'].includes(openingHours);

export const isOpeningHours = (openingHours: string): boolean =>
  !(isEmpty(openingHours) || termsToFilter.reduce(isIncludedIn(openingHours), true));
