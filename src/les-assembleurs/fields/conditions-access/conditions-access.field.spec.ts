/* eslint-disable @typescript-eslint/naming-convention */

import { ConditionAccess } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LesAssembleursLieuMediationNumerique } from '../../helpers';
import { formatConditionAccessField } from './conditions-access.field';

describe('condition access field', (): void => {
  it('should get no value as condition access when key is "Coût accès équipement"', (): void => {
    const conditionsAccess: ConditionAccess[] = formatConditionAccessField({
      'Coût accès équipement': ''
    } as LesAssembleursLieuMediationNumerique);

    expect(conditionsAccess).toStrictEqual([]);
  });

  it('should get no value as condition access when key is "Coût accès médiation numérique"', (): void => {
    const conditionsAccess: ConditionAccess[] = formatConditionAccessField({
      'Coût accès médiation numérique': ''
    } as LesAssembleursLieuMediationNumerique);

    expect(conditionsAccess).toStrictEqual([]);
  });

  it('should get no value as condition access when key is "Coût accès démarches"', (): void => {
    const conditionsAccess: ConditionAccess[] = formatConditionAccessField({
      'Coût accès démarches': ''
    } as LesAssembleursLieuMediationNumerique);

    expect(conditionsAccess).toStrictEqual([]);
  });

  it('should get "Gratuit" as condition access when key is "Coût accès équipement" and value is "Gratuit"', (): void => {
    const conditionsAccess: ConditionAccess[] = formatConditionAccessField({
      'Coût accès équipement': 'Gratuit'
    } as LesAssembleursLieuMediationNumerique);

    expect(conditionsAccess).toStrictEqual([ConditionAccess.Gratuit]);
  });

  it('should get "Gratuit" as condition access when key is "Coût accès médiation numérique" and value is "Gratuit"', (): void => {
    const conditionsAccess: ConditionAccess[] = formatConditionAccessField({
      'Coût accès médiation numérique': 'Gratuit'
    } as LesAssembleursLieuMediationNumerique);

    expect(conditionsAccess).toStrictEqual([ConditionAccess.Gratuit]);
  });

  it('should get "Gratuit" as condition access when key is "Coût accès démarches" and value is "Gratuit"', (): void => {
    const conditionsAccess: ConditionAccess[] = formatConditionAccessField({
      'Coût accès démarches': 'Gratuit'
    } as LesAssembleursLieuMediationNumerique);

    expect(conditionsAccess).toStrictEqual([ConditionAccess.Gratuit]);
  });

  it('should get "Payant" as condition access when key is "Coût accès médiation numérique" and value is "Payant"', (): void => {
    const conditionsAccess: ConditionAccess[] = formatConditionAccessField({
      'Coût accès médiation numérique': 'Payant'
    } as LesAssembleursLieuMediationNumerique);

    expect(conditionsAccess).toStrictEqual([ConditionAccess.Payant]);
  });

  it('should get "Adhésion, Payant" as condition access when key is "Coût accès médiation numérique" and value is "abonnement ou une adhésion"', (): void => {
    const conditionsAccess: ConditionAccess[] = formatConditionAccessField({
      'Coût accès médiation numérique': 'abonnement ou une adhésion'
    } as LesAssembleursLieuMediationNumerique);

    expect(conditionsAccess).toStrictEqual([ConditionAccess.Adhesion, ConditionAccess.Payant]);
  });

  it('should get "Adhésion, Payant" as condition access when key is "Coût accès démarches" and value is "abonnement ou une adhésion"', (): void => {
    const conditionsAccess: ConditionAccess[] = formatConditionAccessField({
      'Coût accès démarches': 'abonnement ou une adhésion'
    } as LesAssembleursLieuMediationNumerique);

    expect(conditionsAccess).toStrictEqual([ConditionAccess.Adhesion, ConditionAccess.Payant]);
  });

  it('should get "Accepte le pass numérique" as condition access when key is "Coût accès médiation numérique" and value is "aptic"', (): void => {
    const conditionsAccess: ConditionAccess[] = formatConditionAccessField({
      'Coût accès médiation numérique': 'Aptic'
    } as LesAssembleursLieuMediationNumerique);

    expect(conditionsAccess).toStrictEqual([ConditionAccess.AccepteLePassNumerique]);
  });

  //   it('should get Gratuit sous condition as condition access', (): void => {
  //     const conditionsAccess: ConditionAccess[] = formatConditionAccessField({
  //       Tarifs: 'gratuit sous condition'
  //     } as LesAssembleursLieuMediationNumerique);

  //     expect(conditionsAccess).toStrictEqual([ConditionAccess.GratuitSousCondition]);
  //   });

  //   it('should get Adhésion as condition access', (): void => {
  //     const conditionsAccess: ConditionAccess[] = formatConditionAccessField({
  //       Tarifs: 'adhésion'
  //     } as LesAssembleursLieuMediationNumerique);

  //     expect(conditionsAccess).toStrictEqual([ConditionAccess.Adhesion]);
  //   });

  //   it('should get Payant as condition access', (): void => {
  //     const conditionsAccess: ConditionAccess[] = formatConditionAccessField({
  //       Tarifs: 'payant'
  //     } as LesAssembleursLieuMediationNumerique);

  //     expect(conditionsAccess).toStrictEqual([ConditionAccess.Payant]);
  //   });

  //   it('should get Pass Numérique as condition access', (): void => {
  //     const conditionsAccess: ConditionAccess[] = formatConditionAccessField({
  //       Tarifs: 'pass numérique'
  //     } as LesAssembleursLieuMediationNumerique);

  //     expect(conditionsAccess).toStrictEqual([ConditionAccess.AccepteLePassNumerique]);
  //   });
});
