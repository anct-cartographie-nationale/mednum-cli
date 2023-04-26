/* eslint-disable @typescript-eslint/no-unnecessary-condition*/
import { PublicAccueilli, PublicsAccueillis } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Choice, LieuxMediationNumeriqueMatching, DataSource } from '../../input';

const isAllowedTerm = (choice: Choice<PublicAccueilli>, sourceValue: string): boolean =>
  choice.sauf?.every((forbidden: string): boolean => !sourceValue.includes(forbidden)) ?? true;

const isTermFound =
  (sourceValue: string, choice: Choice<PublicAccueilli>) =>
  (found: boolean, term: string): boolean =>
    found || (sourceValue?.includes(term.toLowerCase()) && isAllowedTerm(choice, sourceValue));

const containsOneOfTheTerms = (choice: Choice<PublicAccueilli>, sourceValue: string = ''): boolean =>
  choice.termes == null
    ? sourceValue !== ''
    : choice.termes.reduce(isTermFound(sourceValue?.toString().toLowerCase(), choice), false);

const appendPublicAccueilli = (publicsAccueilli: PublicAccueilli[], publicAccueilli?: PublicAccueilli): PublicAccueilli[] => [
  ...publicsAccueilli,
  ...(publicAccueilli == null ? [] : [publicAccueilli])
];

const isDefault = (choice: Choice<PublicAccueilli>): boolean => choice.colonnes == null;

const findAndAppendPublicAccueilli =
  (choice: Choice<PublicAccueilli>, source: DataSource) =>
  (publicsAccueillis: PublicAccueilli[], colonne: string): PublicAccueilli[] =>
    containsOneOfTheTerms(choice, source[colonne]) ? appendPublicAccueilli(publicsAccueillis, choice.cible) : publicsAccueillis;

const publicsAccueilliForTerms =
  (choice: Choice<PublicAccueilli>, source: DataSource) =>
  (publicsAccueillis: PublicAccueilli[], colonne: string): PublicAccueilli[] =>
    isDefault(choice)
      ? appendPublicAccueilli(publicsAccueillis, choice.cible)
      : findAndAppendPublicAccueilli(choice, source)(publicsAccueillis, colonne);

const appendPublicsAccueilli =
  (source: DataSource) =>
  (publicsAccueilli: PublicAccueilli[], choice: Choice<PublicAccueilli>): PublicAccueilli[] =>
    [...publicsAccueilli, ...(choice.colonnes ?? [choice.cible]).reduce(publicsAccueilliForTerms(choice, source), [])];

export const processPublicsAccueillis = (source: DataSource, matching: LieuxMediationNumeriqueMatching): PublicsAccueillis =>
  PublicsAccueillis(Array.from(new Set(matching.publics_accueillis?.reduce(appendPublicsAccueilli(source), []) ?? [])));
