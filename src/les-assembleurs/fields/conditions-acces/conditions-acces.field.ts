import { ConditionAcces } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LesAssembleursLieuMediationNumerique } from '../../helpers';

const CONDITIONS_ACCES: Map<ConditionAcces, { keywords: string[] }> = new Map([
  [ConditionAcces.Gratuit, { keywords: ['gratuit'] }],
  [ConditionAcces.GratuitSousCondition, { keywords: ['gratuit sous condition'] }],
  [ConditionAcces.Adhesion, { keywords: ['adhésion'] }],
  [ConditionAcces.Payant, { keywords: ['payant', 'payante', 'abonnement', 'tarifs', '€', 'euros'] }],
  [ConditionAcces.AccepteLePassNumerique, { keywords: ['pass numérique', 'aptic'] }]
]);

const conditionAccesToProcessIncludesOnOfTheKeywords = (conditionAccesToProcess: string, condition: ConditionAcces): boolean =>
  (CONDITIONS_ACCES.get(condition) ?? { keywords: [] }).keywords.reduce(
    (alreadyIncluded: boolean, keyword: string): boolean =>
      alreadyIncluded || conditionAccesToProcess.toLocaleLowerCase().includes(keyword),
    false
  );

const canAppendConditionAcces = (condition: ConditionAcces, conditionAccesToProcess?: string): boolean =>
  conditionAccesToProcess != null && conditionAccesToProcessIncludesOnOfTheKeywords(conditionAccesToProcess, condition);

const processConditionsAcces = (conditionAccesToProcess?: string): ConditionAcces[] =>
  Array.from(CONDITIONS_ACCES.keys()).reduce(
    (conditions: ConditionAcces[], condition: ConditionAcces): ConditionAcces[] =>
      canAppendConditionAcces(condition, conditionAccesToProcess) ? [...conditions, condition] : conditions,
    []
  );

export const formatConditionsAccesField = (
  lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique
): ConditionAcces[] =>
  Array.from(
    new Set([
      ...processConditionsAcces(lesAssembleursLieuMediationNumerique['Coût accès équipement']),
      ...processConditionsAcces(lesAssembleursLieuMediationNumerique['Coût accès médiation numérique']),
      ...processConditionsAcces(lesAssembleursLieuMediationNumerique['Coût accès démarches'])
    ])
  );
