/* eslint-disable @typescript-eslint/naming-convention */

import { ConditionAccess } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, Source } from '../../input';
import { processConditionsAccess } from './conditions-access.field';

const STANDARD_MATCHING: LieuxMediationNumeriqueMatching = {
  conditionAcces: [
    {
      colonnes: ['Tarifs'],
      termes: ['gratuit'],
      sauf: ['gratuit sous condition'],
      cible: ConditionAccess.Gratuit
    },
    {
      colonnes: ['Tarifs'],
      termes: ['gratuit sous condition'],
      cible: ConditionAccess.GratuitSousCondition
    },
    {
      colonnes: ['Tarifs'],
      termes: ['adhésion'],
      cible: ConditionAccess.Adhesion
    },
    {
      colonnes: ['Tarifs'],
      termes: ['payant'],
      cible: ConditionAccess.Payant
    },
    {
      colonnes: ['Tarifs'],
      termes: ['pass numérique'],
      cible: ConditionAccess.AccepteLePassNumerique
    }
  ]
} as LieuxMediationNumeriqueMatching;

describe('condition access field', (): void => {
  it('should get no value as condition access', (): void => {
    const conditionsAccess: ConditionAccess[] = processConditionsAccess(
      {
        Tarifs: ''
      } as Source,
      STANDARD_MATCHING
    );

    expect(conditionsAccess).toStrictEqual([]);
  });

  it('should get Gratuit as condition access', (): void => {
    const conditionsAccess: ConditionAccess[] = processConditionsAccess(
      {
        Tarifs: 'gratuit'
      } as Source,
      STANDARD_MATCHING
    );

    expect(conditionsAccess).toStrictEqual([ConditionAccess.Gratuit]);
  });

  it('should get Gratuit sous condition as condition access', (): void => {
    const conditionsAccess: ConditionAccess[] = processConditionsAccess(
      {
        Tarifs: 'gratuit sous condition'
      } as Source,
      STANDARD_MATCHING
    );

    expect(conditionsAccess).toStrictEqual([ConditionAccess.GratuitSousCondition]);
  });

  it('should get Adhésion as condition access', (): void => {
    const conditionsAccess: ConditionAccess[] = processConditionsAccess(
      {
        Tarifs: 'adhésion'
      } as Source,
      STANDARD_MATCHING
    );

    expect(conditionsAccess).toStrictEqual([ConditionAccess.Adhesion]);
  });

  it('should get Payant as condition access', (): void => {
    const conditionsAccess: ConditionAccess[] = processConditionsAccess(
      {
        Tarifs: 'payant'
      } as Source,
      STANDARD_MATCHING
    );

    expect(conditionsAccess).toStrictEqual([ConditionAccess.Payant]);
  });

  it('should get Pass Numérique as condition access', (): void => {
    const conditionsAccess: ConditionAccess[] = processConditionsAccess(
      {
        Tarifs: 'pass numérique'
      } as Source,
      STANDARD_MATCHING
    );

    expect(conditionsAccess).toStrictEqual([ConditionAccess.AccepteLePassNumerique]);
  });

  it('should get only one gratuit', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      conditionAcces: [
        {
          colonnes: ['Tarifs', 'Frais à charge'],
          termes: ['gratuit', 'sans frais'],
          cible: ConditionAccess.Gratuit
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const conditionsAccess: ConditionAccess[] = processConditionsAccess(
      {
        Tarifs: 'gratuit',
        'Frais à charge': 'sans frais'
      } as Source,
      matching
    );

    expect(conditionsAccess).toStrictEqual([ConditionAccess.Gratuit]);
  });

  it('should get nothing when no check in Gratuit column', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      conditionAcces: [
        {
          colonnes: ['Gratuit'],
          cible: ConditionAccess.Gratuit
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const conditionsAccess: ConditionAccess[] = processConditionsAccess(
      {
        Gratuit: ''
      } as Source,
      matching
    );

    expect(conditionsAccess).toStrictEqual([]);
  });

  it('should get gratuit when check in specific column', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      conditionAcces: [
        {
          colonnes: ['Gratuit'],
          cible: ConditionAccess.Gratuit
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const conditionsAccess: ConditionAccess[] = processConditionsAccess(
      {
        Gratuit: 'X'
      } as Source,
      matching
    );

    expect(conditionsAccess).toStrictEqual([ConditionAccess.Gratuit]);
  });
});
