import { ConditionAccess } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { HinauraLieuMediationNumerique } from '../../helper';

const CONDITIONS_ACCESS: Map<ConditionAccess, { keywords: string[]; blacklisted?: string }> = new Map([
  [ConditionAccess.Gratuit, { keywords: ['gratuit'], blacklisted: 'gratuit sous condition' }],
  [ConditionAccess.GratuitSousCondition, { keywords: ['gratuit sous condition'] }],
  [ConditionAccess.Adhesion, { keywords: ['adhésion'] }],
  [ConditionAccess.Payant, { keywords: ['payant'] }],
  [ConditionAccess.AccepteLePassNumerique, { keywords: ['pass numérique'] }]
]);

const appendConditionsAccess = (
  conditionsAccess: ConditionAccess[],
  newConditionsAccess: ConditionAccess
): ConditionAccess[] => [...conditionsAccess, newConditionsAccess];

const keywordFound = (conditionAccessFromHinaura: string, keyword: string): boolean =>
  conditionAccessFromHinaura.toLocaleLowerCase().includes(keyword);

const keywordIsBlacklisted = (conditionAccessFromHinaura: string, blackListedValue?: string): boolean =>
  blackListedValue != null && conditionAccessFromHinaura.toLocaleLowerCase().includes(blackListedValue);

const whenConditionsAccessFromHinauraContainsKeyword = (
  conditionAccessFromHinaura: string,
  conditionAccess: ConditionAccess
): boolean =>
  (CONDITIONS_ACCESS.get(conditionAccess) ?? { keywords: [], blacklisted: '' }).keywords.reduce(
    (alreadyIncluded: boolean, keyword: string): boolean =>
      alreadyIncluded ||
      (keywordFound(conditionAccessFromHinaura, keyword) &&
        !keywordIsBlacklisted(conditionAccessFromHinaura, CONDITIONS_ACCESS.get(conditionAccess)?.blacklisted)),
    false
  );

const appendConditionAccessMatchingKeywords =
  (conditionAccessFromHinaura: string) =>
  (concatConditionAccess: ConditionAccess[], conditionAccess: ConditionAccess): ConditionAccess[] =>
    whenConditionsAccessFromHinauraContainsKeyword(conditionAccessFromHinaura, conditionAccess)
      ? appendConditionsAccess(concatConditionAccess, conditionAccess)
      : concatConditionAccess;

export const processConditionsAccess = (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique): ConditionAccess[] =>
  Array.from(CONDITIONS_ACCESS.keys()).reduce(appendConditionAccessMatchingKeywords(hinauraLieuMediationNumerique.Tarifs), []);
