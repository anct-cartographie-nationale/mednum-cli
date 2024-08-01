/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Frais, FraisACharge } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
import { processFraisACharge } from './frais-a-charge.field';

const STANDARD_MATCHING: LieuxMediationNumeriqueMatching = {
  frais_a_charge: [
    {
      colonnes: ['Tarifs'],
      termes: ['gratuit'],
      sauf: ['gratuit sous condition'],
      cible: Frais.Gratuit
    },
    {
      colonnes: ['Tarifs'],
      termes: ['gratuit sous condition'],
      cible: Frais.GratuitSousCondition
    },
    {
      colonnes: ['Tarifs'],
      termes: ['payant'],
      cible: Frais.Payant
    }
  ]
} as LieuxMediationNumeriqueMatching;

describe('condition acces field', (): void => {
  it('should get no value as frais à charge', (): void => {
    const fraisACharge: FraisACharge = processFraisACharge(
      {
        Tarifs: ''
      } as DataSource,
      STANDARD_MATCHING
    );

    expect(fraisACharge).toStrictEqual([]);
  });

  it('should get Gratuit as frais à charge', (): void => {
    const fraisACharge: FraisACharge = processFraisACharge(
      {
        Tarifs: 'gratuit'
      } as DataSource,
      STANDARD_MATCHING
    );

    expect(fraisACharge).toStrictEqual([Frais.Gratuit]);
  });

  it('should get Gratuit sous condition as frais à charge', (): void => {
    const fraisACharge: FraisACharge = processFraisACharge(
      {
        Tarifs: 'gratuit sous condition'
      } as DataSource,
      STANDARD_MATCHING
    );

    expect(fraisACharge).toStrictEqual([Frais.GratuitSousCondition]);
  });

  it('should get Payant as frais à charge', (): void => {
    const fraisACharge: FraisACharge = processFraisACharge(
      {
        Tarifs: 'payant'
      } as DataSource,
      STANDARD_MATCHING
    );

    expect(fraisACharge).toStrictEqual([Frais.Payant]);
  });

  it('should get only one gratuit', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      frais_a_charge: [
        {
          colonnes: ['Tarifs', 'Frais à charge'],
          termes: ['gratuit', 'sans frais'],
          cible: Frais.Gratuit
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const fraisACharge: FraisACharge = processFraisACharge(
      { Tarifs: 'gratuit', 'Frais à charge': 'sans frais' } as DataSource,
      matching
    );

    expect(fraisACharge).toStrictEqual([Frais.Gratuit]);
  });

  it('should get nothing when no check in Gratuit column', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      frais_a_charge: [{ colonnes: ['Gratuit'], cible: Frais.Gratuit }]
    } as LieuxMediationNumeriqueMatching;

    const fraisACharge: FraisACharge = processFraisACharge({ Gratuit: '' } as DataSource, matching);

    expect(fraisACharge).toStrictEqual([]);
  });

  it('should get gratuit when check in specific column', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      frais_a_charge: [{ colonnes: ['Gratuit'], cible: Frais.Gratuit }]
    } as LieuxMediationNumeriqueMatching;

    const fraisACharge: FraisACharge = processFraisACharge({ Gratuit: 'X' } as DataSource, matching);

    expect(fraisACharge).toStrictEqual([Frais.Gratuit]);
  });

  it('should get gratuit default condition acces', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      frais_a_charge: [{ cible: Frais.Gratuit }]
    } as LieuxMediationNumeriqueMatching;

    const fraisACharge: FraisACharge = processFraisACharge({} as DataSource, matching);

    expect(fraisACharge).toStrictEqual([Frais.Gratuit]);
  });
});
