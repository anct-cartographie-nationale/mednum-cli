import { ConditionAcces, ConditionsAcces } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Choice, LieuxMediationNumeriqueMatching, DataSource } from '../../input';

const isAllowedTerm = (choice: Choice<ConditionAcces>, sourceValue: string): boolean =>
  choice.sauf?.every((forbidden: string): boolean => !sourceValue.includes(forbidden)) ?? true;

const isTermFound =
  (sourceValue: string, choice: Choice<ConditionAcces>) =>
  (found: boolean, term: string): boolean =>
    found || (sourceValue.includes(term.toLowerCase()) && isAllowedTerm(choice, sourceValue));

const containsOneOfTheTerms = (choice: Choice<ConditionAcces>, sourceValue: string = ''): boolean =>
  choice.termes == null ? sourceValue !== '' : choice.termes.reduce(isTermFound(sourceValue.toLowerCase(), choice), false);

const appendConditionAcces = (conditionsAcces: ConditionAcces[], conditionAcces?: ConditionAcces): ConditionAcces[] => [
  ...conditionsAcces,
  ...(conditionAcces == null ? [] : [conditionAcces])
];

const conditionsAccesForTerms =
  (choice: Choice<ConditionAcces>, source: DataSource) =>
  (conditionsAcces: ConditionAcces[], colonne: string): ConditionAcces[] =>
    containsOneOfTheTerms(choice, source[colonne]) ? appendConditionAcces(conditionsAcces, choice.cible) : conditionsAcces;

const appendConditionsAcces =
  (source: DataSource) =>
  (conditionsAcces: ConditionAcces[], choice: Choice<ConditionAcces>): ConditionAcces[] =>
    [...conditionsAcces, ...(choice.colonnes ?? []).reduce(conditionsAccesForTerms(choice, source), [])];

export const processConditionsAcces = (source: DataSource, matching: LieuxMediationNumeriqueMatching): ConditionsAcces =>
  ConditionsAcces(Array.from(new Set(matching.conditionAcces.reduce(appendConditionsAcces(source), []))));
