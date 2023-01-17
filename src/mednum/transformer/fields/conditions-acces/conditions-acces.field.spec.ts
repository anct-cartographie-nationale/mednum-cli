/* eslint-disable @typescript-eslint/naming-convention */

import { ConditionAcces } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
import { processConditionsAcces } from './conditions-acces.field';

const STANDARD_MATCHING: LieuxMediationNumeriqueMatching = {
  conditionAcces: [
    {
      colonnes: ['Tarifs'],
      termes: ['gratuit'],
      sauf: ['gratuit sous condition'],
      cible: ConditionAcces.Gratuit
    },
    {
      colonnes: ['Tarifs'],
      termes: ['gratuit sous condition'],
      cible: ConditionAcces.GratuitSousCondition
    },
    {
      colonnes: ['Tarifs'],
      termes: ['adhésion'],
      cible: ConditionAcces.Adhesion
    },
    {
      colonnes: ['Tarifs'],
      termes: ['payant'],
      cible: ConditionAcces.Payant
    },
    {
      colonnes: ['Tarifs'],
      termes: ['pass numérique'],
      cible: ConditionAcces.AccepteLePassNumerique
    }
  ]
} as LieuxMediationNumeriqueMatching;

describe('condition acces field', (): void => {
  it('should get no value as condition acces', (): void => {
    const conditionsAcces: ConditionAcces[] = processConditionsAcces(
      {
        Tarifs: ''
      } as DataSource,
      STANDARD_MATCHING
    );

    expect(conditionsAcces).toStrictEqual([]);
  });

  it('should get Gratuit as condition acces', (): void => {
    const conditionsAcces: ConditionAcces[] = processConditionsAcces(
      {
        Tarifs: 'gratuit'
      } as DataSource,
      STANDARD_MATCHING
    );

    expect(conditionsAcces).toStrictEqual([ConditionAcces.Gratuit]);
  });

  it('should get Gratuit sous condition as condition acces', (): void => {
    const conditionsAcces: ConditionAcces[] = processConditionsAcces(
      {
        Tarifs: 'gratuit sous condition'
      } as DataSource,
      STANDARD_MATCHING
    );

    expect(conditionsAcces).toStrictEqual([ConditionAcces.GratuitSousCondition]);
  });

  it('should get Adhésion as condition acces', (): void => {
    const conditionsAcces: ConditionAcces[] = processConditionsAcces(
      {
        Tarifs: 'adhésion'
      } as DataSource,
      STANDARD_MATCHING
    );

    expect(conditionsAcces).toStrictEqual([ConditionAcces.Adhesion]);
  });

  it('should get Payant as condition acces', (): void => {
    const conditionsAcces: ConditionAcces[] = processConditionsAcces(
      {
        Tarifs: 'payant'
      } as DataSource,
      STANDARD_MATCHING
    );

    expect(conditionsAcces).toStrictEqual([ConditionAcces.Payant]);
  });

  it('should get Pass Numérique as condition acces', (): void => {
    const conditionsAcces: ConditionAcces[] = processConditionsAcces(
      {
        Tarifs: 'pass numérique'
      } as DataSource,
      STANDARD_MATCHING
    );

    expect(conditionsAcces).toStrictEqual([ConditionAcces.AccepteLePassNumerique]);
  });

  it('should get only one gratuit', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      conditionAcces: [
        {
          colonnes: ['Tarifs', 'Frais à charge'],
          termes: ['gratuit', 'sans frais'],
          cible: ConditionAcces.Gratuit
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const conditionsAcces: ConditionAcces[] = processConditionsAcces(
      {
        Tarifs: 'gratuit',
        'Frais à charge': 'sans frais'
      } as DataSource,
      matching
    );

    expect(conditionsAcces).toStrictEqual([ConditionAcces.Gratuit]);
  });

  it('should get nothing when no check in Gratuit column', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      conditionAcces: [
        {
          colonnes: ['Gratuit'],
          cible: ConditionAcces.Gratuit
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const conditionsAcces: ConditionAcces[] = processConditionsAcces(
      {
        Gratuit: ''
      } as DataSource,
      matching
    );

    expect(conditionsAcces).toStrictEqual([]);
  });

  it('should get gratuit when check in specific column', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      conditionAcces: [
        {
          colonnes: ['Gratuit'],
          cible: ConditionAcces.Gratuit
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const conditionsAcces: ConditionAcces[] = processConditionsAcces(
      {
        Gratuit: 'X'
      } as DataSource,
      matching
    );

    expect(conditionsAcces).toStrictEqual([ConditionAcces.Gratuit]);
  });

  it('should get gratuit default condition acces', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      conditionAcces: [
        {
          cible: ConditionAcces.Gratuit
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const conditionsAcces: ConditionAcces[] = processConditionsAcces({} as DataSource, matching);

    expect(conditionsAcces).toStrictEqual([ConditionAcces.Gratuit]);
  });
});
