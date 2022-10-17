import { ConditionAccess } from '@gouvfr-anct/lieux-de-mediation-numerique';

const CONDITIONS_ACCESS: Map<ConditionAccess, { keywords: string[]; blacklisted?: string }> = new Map([
  [ConditionAccess.Gratuit, { keywords: ['gratuit'], blacklisted: 'gratuit sous condition' }],
  [ConditionAccess.GratuitSousCondition, { keywords: ['gratuit sous condition'] }],
  [ConditionAccess.Adhesion, { keywords: ['adhésion'] }],
  [ConditionAccess.Payant, { keywords: ['payant'] }],
  [ConditionAccess.AccepteLePassNumerique, { keywords: ['pass numérique'] }]
]);

const appendConditionsAccess = (conditionsAccess: string, newConditionsAccess: string): string =>
  [newConditionsAccess, ...(conditionsAccess === '' ? [] : [conditionsAccess])].join(',');

const whenConditionsAccessFromHinauraContainsKeyword = (
  conditionAccessFromHinaura: string,
  conditionAccess: ConditionAccess
): boolean =>
  (CONDITIONS_ACCESS.get(conditionAccess) ?? { keywords: [], blacklisted: '' }).keywords.reduce(
    (alreadyIncluded: boolean, keyword: string): boolean =>
      alreadyIncluded ||
      (conditionAccessFromHinaura.toLocaleLowerCase().includes(keyword) &&
        !conditionAccessFromHinaura.toLocaleLowerCase().includes(CONDITIONS_ACCESS.get(conditionAccess)?.blacklisted!)),
    false
  );

const appendConditionAccessMatchingKeywords =
  (conditionAccessFromHinaura: string) =>
  (concatConditionAccess: string, conditionAccess: ConditionAccess): string =>
    whenConditionsAccessFromHinauraContainsKeyword(conditionAccessFromHinaura, conditionAccess)
      ? appendConditionsAccess(concatConditionAccess, conditionAccess)
      : concatConditionAccess;

export const processConditionsAccess = (conditionsAccess: string): string =>
  Array.from(CONDITIONS_ACCESS.keys()).reduce(appendConditionAccessMatchingKeywords(conditionsAccess), '');
