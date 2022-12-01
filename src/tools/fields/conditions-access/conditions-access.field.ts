import { ConditionAccess, ConditionsAccess } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Choice, LieuxMediationNumeriqueMatching, Source } from '../../input';

const isAllowedTerm = (choice: Choice<ConditionAccess>, sourceValue: string): boolean =>
  choice.sauf?.every((forbidden: string): boolean => !sourceValue.includes(forbidden)) ?? true;

const isTermFound =
  (sourceValue: string, choice: Choice<ConditionAccess>) =>
  (found: boolean, term: string): boolean =>
    found || (sourceValue.includes(term.toLowerCase()) && isAllowedTerm(choice, sourceValue));

const containsOneOfTheTerms = (choice: Choice<ConditionAccess>, sourceValue: string = ''): boolean =>
  choice.termes == null ? sourceValue !== '' : choice.termes.reduce(isTermFound(sourceValue.toLowerCase(), choice), false);

const appendConditionAccess = (conditionsAccess: ConditionAccess[], conditionAccess?: ConditionAccess): ConditionAccess[] => [
  ...conditionsAccess,
  ...(conditionAccess == null ? [] : [conditionAccess])
];

const conditionsAccessForTerms =
  (choice: Choice<ConditionAccess>, source: Source) =>
  (conditionsAccess: ConditionAccess[], colonne: string): ConditionAccess[] =>
    containsOneOfTheTerms(choice, source[colonne]) ? appendConditionAccess(conditionsAccess, choice.cible) : conditionsAccess;

const appendConditionsAccess =
  (source: Source) =>
  (conditionsAccess: ConditionAccess[], choice: Choice<ConditionAccess>): ConditionAccess[] =>
    [...conditionsAccess, ...(choice.colonnes ?? []).reduce(conditionsAccessForTerms(choice, source), [])];

export const processConditionsAccess = (source: Source, matching: LieuxMediationNumeriqueMatching): ConditionsAccess =>
  ConditionsAccess(Array.from(new Set(matching.conditionAcces.reduce(appendConditionsAccess(source), []))));
