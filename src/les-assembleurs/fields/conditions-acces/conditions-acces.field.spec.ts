/* eslint-disable @typescript-eslint/naming-convention */

import { ConditionAcces } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LesAssembleursLieuMediationNumerique } from '../../helpers';
import { formatConditionsAccesField } from './conditions-acces.field';

describe('condition acces field', (): void => {
  it('should get no value as condition acces when key is "Coût accès équipement"', (): void => {
    const conditionAcces: ConditionAcces[] = formatConditionsAccesField({
      'Coût accès équipement': ''
    } as LesAssembleursLieuMediationNumerique);

    expect(conditionAcces).toStrictEqual([]);
  });

  it('should get no value as condition acces when key is "Coût accès médiation numérique"', (): void => {
    const conditionAcces: ConditionAcces[] = formatConditionsAccesField({
      'Coût accès médiation numérique': ''
    } as LesAssembleursLieuMediationNumerique);

    expect(conditionAcces).toStrictEqual([]);
  });

  it('should get no value as condition acces when key is "Coût accès démarches"', (): void => {
    const conditionAcces: ConditionAcces[] = formatConditionsAccesField({
      'Coût accès démarches': ''
    } as LesAssembleursLieuMediationNumerique);

    expect(conditionAcces).toStrictEqual([]);
  });

  it('should get "Gratuit" as condition acces when key is "Coût accès équipement" and value is "Gratuit"', (): void => {
    const conditionAcces: ConditionAcces[] = formatConditionsAccesField({
      'Coût accès équipement': 'Gratuit'
    } as LesAssembleursLieuMediationNumerique);

    expect(conditionAcces).toStrictEqual([ConditionAcces.Gratuit]);
  });

  it('should get "Gratuit" as condition acces when key is "Coût accès médiation numérique" and value is "Gratuit"', (): void => {
    const conditionAcces: ConditionAcces[] = formatConditionsAccesField({
      'Coût accès médiation numérique': 'Gratuit'
    } as LesAssembleursLieuMediationNumerique);

    expect(conditionAcces).toStrictEqual([ConditionAcces.Gratuit]);
  });

  it('should get "Gratuit" as condition acces when key is "Coût accès démarches" and value is "Gratuit"', (): void => {
    const conditionAcces: ConditionAcces[] = formatConditionsAccesField({
      'Coût accès démarches': 'Gratuit'
    } as LesAssembleursLieuMediationNumerique);

    expect(conditionAcces).toStrictEqual([ConditionAcces.Gratuit]);
  });

  it('should get "Payant" as condition acces when key is "Coût accès médiation numérique" and value is "Payant"', (): void => {
    const conditionAcces: ConditionAcces[] = formatConditionsAccesField({
      'Coût accès médiation numérique': 'Payant'
    } as LesAssembleursLieuMediationNumerique);

    expect(conditionAcces).toStrictEqual([ConditionAcces.Payant]);
  });

  it('should get "Adhésion, Payant" as condition acces when key is "Coût accès médiation numérique" and value is "abonnement ou une adhésion"', (): void => {
    const conditionAcces: ConditionAcces[] = formatConditionsAccesField({
      'Coût accès médiation numérique': 'abonnement ou une adhésion'
    } as LesAssembleursLieuMediationNumerique);

    expect(conditionAcces).toStrictEqual([ConditionAcces.Adhesion, ConditionAcces.Payant]);
  });

  it('should get "Adhésion, Payant" as condition acces when key is "Coût accès démarches" and value is "abonnement ou une adhésion"', (): void => {
    const conditionAcces: ConditionAcces[] = formatConditionsAccesField({
      'Coût accès démarches': 'abonnement ou une adhésion'
    } as LesAssembleursLieuMediationNumerique);

    expect(conditionAcces).toStrictEqual([ConditionAcces.Adhesion, ConditionAcces.Payant]);
  });

  it('should get "Accepte le pass numérique" as condition acces when key is "Coût accès médiation numérique" and value is "aptic"', (): void => {
    const conditionAcces: ConditionAcces[] = formatConditionsAccesField({
      'Coût accès médiation numérique': 'Aptic'
    } as LesAssembleursLieuMediationNumerique);

    expect(conditionAcces).toStrictEqual([ConditionAcces.AccepteLePassNumerique]);
  });

  //   it('should get Gratuit sous condition as condition acces', (): void => {
  //     const conditionAcces: ConditionAcces[] = formatConditionsAccesField({
  //       Tarifs: 'gratuit sous condition'
  //     } as LesAssembleursLieuMediationNumerique);

  //     expect(conditionAcces).toStrictEqual([ConditionAcces.GratuitSousCondition]);
  //   });

  //   it('should get Adhésion as condition acces', (): void => {
  //     const conditionAcces: ConditionAcces[] = formatConditionsAccesField({
  //       Tarifs: 'adhésion'
  //     } as LesAssembleursLieuMediationNumerique);

  //     expect(conditionAcces).toStrictEqual([ConditionAcces.Adhesion]);
  //   });

  //   it('should get Payant as condition acces', (): void => {
  //     const conditionAcces: ConditionAcces[] = formatConditionsAccesField({
  //       Tarifs: 'payant'
  //     } as LesAssembleursLieuMediationNumerique);

  //     expect(conditionAcces).toStrictEqual([ConditionAcces.Payant]);
  //   });

  //   it('should get Pass Numérique as condition acces', (): void => {
  //     const conditionAcces: ConditionAcces[] = formatConditionsAccesField({
  //       Tarifs: 'pass numérique'
  //     } as LesAssembleursLieuMediationNumerique);

  //     expect(conditionAcces).toStrictEqual([ConditionAcces.AccepteLePassNumerique]);
  //   });
});
