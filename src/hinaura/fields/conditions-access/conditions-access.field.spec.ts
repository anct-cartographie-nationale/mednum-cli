import { ConditionAccess } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { processConditionsAccess } from './conditions-access.field';

describe('condition access field', (): void => {
  it('should get no value as condition access', (): void => {
    const conditionsAccess: string = processConditionsAccess('');

    expect(conditionsAccess).toBe('');
  });

  it('should get Gratuit as condition access', (): void => {
    const conditionsAccess: string = processConditionsAccess('gratuit');

    expect(conditionsAccess).toBe(ConditionAccess.Gratuit);
  });

  it('should get Gratuit sous condition as condition access', (): void => {
    const conditionsAccess: string = processConditionsAccess('gratuit sous condition');

    expect(conditionsAccess).toBe(ConditionAccess.GratuitSousCondition);
  });

  it('should get Adhésion as condition access', (): void => {
    const conditionsAccess: string = processConditionsAccess('adhésion');

    expect(conditionsAccess).toBe(ConditionAccess.Adhesion);
  });

  it('should get Payant as condition access', (): void => {
    const conditionsAccess: string = processConditionsAccess('payant');

    expect(conditionsAccess).toBe(ConditionAccess.Payant);
  });

  it('should get Pass Numérique as condition access', (): void => {
    const conditionsAccess: string = processConditionsAccess('pass numérique');

    expect(conditionsAccess).toBe(ConditionAccess.AccepteLePassNumerique);
  });
});
