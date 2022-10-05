import { ConditionAccess } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LesAssembleursLieuMediationNumerique } from '../../helpers';

const CONDITIONS_ACCESS: Map<ConditionAccess, { keywords: string[] }> = new Map([
  [ConditionAccess.Gratuit, { keywords: ['gratuit'] }],
  [ConditionAccess.GratuitSousCondition, { keywords: ['gratuit sous condition'] }],
  [ConditionAccess.Adhesion, { keywords: ['adhésion'] }],
  [ConditionAccess.Payant, { keywords: ['payant', 'payante', 'abonnement', 'tarifs', '€', 'euros'] }],
  [ConditionAccess.AccepteLePassNumerique, { keywords: ['pass numérique', 'aptic'] }]
]);

const conditionAccessToProcessIncludesOnOfTheKeywords = (
  conditionAccessToProcess: string,
  condition: ConditionAccess
): boolean =>
  (CONDITIONS_ACCESS.get(condition) ?? { keywords: [] }).keywords.reduce(
    (alreadyIncluded: boolean, keyword: string): boolean =>
      alreadyIncluded || conditionAccessToProcess.toLocaleLowerCase().includes(keyword),
    false
  );

const canAppendConditionAccess = (condition: ConditionAccess, conditionAccessToProcess?: string): boolean =>
  conditionAccessToProcess != null && conditionAccessToProcessIncludesOnOfTheKeywords(conditionAccessToProcess, condition);

const processConditionsAccess = (conditionAccessToProcess?: string): ConditionAccess[] =>
  Array.from(CONDITIONS_ACCESS.keys()).reduce(
    (conditions: ConditionAccess[], condition: ConditionAccess): ConditionAccess[] =>
      canAppendConditionAccess(condition, conditionAccessToProcess) ? [...conditions, condition] : conditions,
    []
  );

export const formatConditionAccessField = (
  lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique
): ConditionAccess[] =>
  Array.from(
    new Set([
      ...processConditionsAccess(lesAssembleursLieuMediationNumerique['Coût accès équipement']),
      ...processConditionsAccess(lesAssembleursLieuMediationNumerique['Coût accès médiation numérique']),
      ...processConditionsAccess(lesAssembleursLieuMediationNumerique['Coût accès démarches'])
    ])
  );
