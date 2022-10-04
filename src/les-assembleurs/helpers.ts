/* eslint-disable @typescript-eslint/naming-convention */

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

const isIncludedIn =
  (openingHours: string) =>
  (shouldFilter: boolean, termToFilter: string): boolean =>
    shouldFilter || openingHours.includes(termToFilter);

const isEmpty = (openingHours: string): boolean => ['-----', '-'].includes(openingHours);

export const isOpeningHours = (openingHours: string): boolean =>
  !(isEmpty(openingHours) || termsToFilter.reduce(isIncludedIn(openingHours), true));
