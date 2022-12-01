import { PublicAccueilli, PublicsAccueillis } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Choice, LieuxMediationNumeriqueMatching, Source } from '../../input';

const isAllowedTerm = (choice: Choice<PublicAccueilli>, sourceValue: string): boolean =>
  choice.sauf?.every((forbidden: string): boolean => !sourceValue.includes(forbidden)) ?? true;

const isTermFound =
  (sourceValue: string, choice: Choice<PublicAccueilli>) =>
  (found: boolean, term: string): boolean =>
    found || (sourceValue.includes(term.toLowerCase()) && isAllowedTerm(choice, sourceValue));

const containsOneOfTheTerms = (choice: Choice<PublicAccueilli>, sourceValue: string = ''): boolean =>
  choice.termes == null ? sourceValue !== '' : choice.termes.reduce(isTermFound(sourceValue.toLowerCase(), choice), false);

const appendPublicAccueilli = (publicsAccueilli: PublicAccueilli[], publicAccueilli?: PublicAccueilli): PublicAccueilli[] => [
  ...publicsAccueilli,
  ...(publicAccueilli == null ? [] : [publicAccueilli])
];

const publicsAccueilliForTerms =
  (choice: Choice<PublicAccueilli>, source: Source) =>
  (publicsAccueilli: PublicAccueilli[], colonne: string): PublicAccueilli[] =>
    containsOneOfTheTerms(choice, source[colonne]) ? appendPublicAccueilli(publicsAccueilli, choice.cible) : publicsAccueilli;

const appendPublicsAccueilli =
  (source: Source) =>
  (publicsAccueilli: PublicAccueilli[], choice: Choice<PublicAccueilli>): PublicAccueilli[] =>
    [...publicsAccueilli, ...(choice.colonnes ?? []).reduce(publicsAccueilliForTerms(choice, source), [])];

export const processPublicAccueilli = (source: Source, matching: LieuxMediationNumeriqueMatching): PublicsAccueillis =>
  PublicsAccueillis(Array.from(new Set(matching.publics_accueillis.reduce(appendPublicsAccueilli(source), []))));
