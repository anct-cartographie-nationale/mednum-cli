/* eslint-disable @typescript-eslint/naming-convention */

import { ConditionAccess } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { processConditionsAccess } from './conditions-access.field';
import { HinauraLieuMediationNumerique } from '../../helper';

describe('condition access field', (): void => {
  it('should get no value as condition access', (): void => {
    const conditionsAccess: ConditionAccess[] = processConditionsAccess({
      Tarifs: ''
    } as HinauraLieuMediationNumerique);

    expect(conditionsAccess).toStrictEqual([]);
  });

  it('should get Gratuit as condition access', (): void => {
    const conditionsAccess: ConditionAccess[] = processConditionsAccess({
      Tarifs: 'gratuit'
    } as HinauraLieuMediationNumerique);

    expect(conditionsAccess).toStrictEqual([ConditionAccess.Gratuit]);
  });

  it('should get Gratuit sous condition as condition access', (): void => {
    const conditionsAccess: ConditionAccess[] = processConditionsAccess({
      Tarifs: 'gratuit sous condition'
    } as HinauraLieuMediationNumerique);

    expect(conditionsAccess).toStrictEqual([ConditionAccess.GratuitSousCondition]);
  });

  it('should get Adhésion as condition access', (): void => {
    const conditionsAccess: ConditionAccess[] = processConditionsAccess({
      Tarifs: 'adhésion'
    } as HinauraLieuMediationNumerique);

    expect(conditionsAccess).toStrictEqual([ConditionAccess.Adhesion]);
  });

  it('should get Payant as condition access', (): void => {
    const conditionsAccess: ConditionAccess[] = processConditionsAccess({
      Tarifs: 'payant'
    } as HinauraLieuMediationNumerique);

    expect(conditionsAccess).toStrictEqual([ConditionAccess.Payant]);
  });

  it('should get Pass Numérique as condition access', (): void => {
    const conditionsAccess: ConditionAccess[] = processConditionsAccess({
      Tarifs: 'pass numérique'
    } as HinauraLieuMediationNumerique);

    expect(conditionsAccess).toStrictEqual([ConditionAccess.AccepteLePassNumerique]);
  });
});
