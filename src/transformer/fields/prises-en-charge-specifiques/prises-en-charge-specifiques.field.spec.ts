/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { PriseEnChargeSpecifique, PrisesEnChargeSpecifiques } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching } from '../../input';
import { processPrisesEnChargeSpecifiques } from './prises-en-charge-specifiques.field';

const MATCHING: LieuxMediationNumeriqueMatching = {
  prise_en_charge_specifique: [
    {
      colonnes: ['Publics accueillis', 'Accueil pour les personnes en situation de handicap'],
      termes: ['surdité', 'tout public'],
      cible: PriseEnChargeSpecifique.Surdite
    },
    {
      colonnes: ['Publics accueillis', 'Accueil pour les personnes en situation de handicap'],
      termes: ['handicap mental', 'tout public'],
      cible: PriseEnChargeSpecifique.HandicapsMentaux
    },
    {
      colonnes: ['Publics accueillis', 'Accueil pour les personnes en situation de handicap'],
      termes: ["personnes en situation d'illettrisme", 'tout public'],
      cible: PriseEnChargeSpecifique.Illettrisme
    },
    {
      colonnes: ['Publics accueillis', 'Accueil pour les personnes en situation de handicap'],
      termes: ['langue étrangère', 'langue etrangere', 'tout public'],
      cible: PriseEnChargeSpecifique.LanguesEtrangeresAutre
    },
    {
      colonnes: ['Publics accueillis', 'Accueil pour les personnes en situation de handicap'],
      termes: ['anglais', 'tout public'],
      cible: PriseEnChargeSpecifique.LanguesEtrangeresAnglais
    },
    {
      colonnes: ['Publics accueillis', 'Accueil pour les personnes en situation de handicap'],
      termes: ['handicap moteur', 'tout public'],
      cible: PriseEnChargeSpecifique.HandicapsMoteurs
    },
    {
      colonnes: [
        'Publics accueillis',
        'Accueil pour les personnes en situation de handicap',
        'Accompagnement de publics spécifiques'
      ],
      termes: ['cécité', 'déficience visuelle', 'tout public'],
      cible: PriseEnChargeSpecifique.DeficienceVisuelle
    }
  ]
} as LieuxMediationNumeriqueMatching;

describe('prises en charge spécifiques field', (): void => {
  it('should handle empty value', (): void => {
    const publicsAccueillis: PrisesEnChargeSpecifiques = processPrisesEnChargeSpecifiques({}, MATCHING);

    expect(publicsAccueillis).toStrictEqual([]);
  });

  it('should not find any publics accueillis matching Publics accueillis key', (): void => {
    const publicsAccueillis: PrisesEnChargeSpecifiques = processPrisesEnChargeSpecifiques(
      {
        'Publics accueillis': ''
      },
      MATCHING
    );

    expect(publicsAccueillis).toStrictEqual([]);
  });

  it('should not find any publics accueillis matching Accueil pour les personnes en situation de handicap key', (): void => {
    const publicsAccueillis: PrisesEnChargeSpecifiques = processPrisesEnChargeSpecifiques(
      {
        'Accueil pour les personnes en situation de handicap': ''
      },
      MATCHING
    );

    expect(publicsAccueillis).toStrictEqual([]);
  });

  it('should find "Surdité" publics accueillis', (): void => {
    const publicsAccueillis: PrisesEnChargeSpecifiques = processPrisesEnChargeSpecifiques(
      {
        'Publics accueillis': 'surdité'
      },
      MATCHING
    );

    expect(publicsAccueillis).toStrictEqual([PriseEnChargeSpecifique.Surdite]);
  });

  it('should find "handicap mentaux, handicap moteurs" publics accueillis', (): void => {
    const publicsAccueillis: PrisesEnChargeSpecifiques = processPrisesEnChargeSpecifiques(
      {
        'Publics accueillis': 'handicap mental, handicap moteur'
      },
      MATCHING
    );

    expect(publicsAccueillis).toStrictEqual([
      PriseEnChargeSpecifique.HandicapsMentaux,
      PriseEnChargeSpecifique.HandicapsMoteurs
    ]);
  });

  it('should find "Deficience visuelle" publics accueillis', (): void => {
    const publicsAccueillis: PrisesEnChargeSpecifiques = processPrisesEnChargeSpecifiques(
      {
        'Publics accueillis': 'cécité'
      },
      MATCHING
    );

    expect(publicsAccueillis).toStrictEqual([PriseEnChargeSpecifique.DeficienceVisuelle]);
  });

  it('should find "langue étrangère" publics accueillis - senior with accented chars', (): void => {
    const publicsAccueillis: PrisesEnChargeSpecifiques = processPrisesEnChargeSpecifiques(
      {
        'Publics accueillis': 'langue étrangère'
      },
      MATCHING
    );

    expect(publicsAccueillis).toStrictEqual([PriseEnChargeSpecifique.LanguesEtrangeresAutre]);
  });

  it('should find "langue étrangère" publics accueillis - senior without accented chars', (): void => {
    const publicsAccueillis: PrisesEnChargeSpecifiques = processPrisesEnChargeSpecifiques(
      {
        'Publics accueillis': 'langue etrangere'
      },
      MATCHING
    );

    expect(publicsAccueillis).toStrictEqual([PriseEnChargeSpecifique.LanguesEtrangeresAutre]);
  });

  it('should find all publics accueillis', (): void => {
    const publicsAccueillis: PrisesEnChargeSpecifiques = processPrisesEnChargeSpecifiques(
      {
        'Publics accueillis': 'tout public'
      },
      MATCHING
    );

    expect(publicsAccueillis).toStrictEqual([
      PriseEnChargeSpecifique.Surdite,
      PriseEnChargeSpecifique.HandicapsMentaux,
      PriseEnChargeSpecifique.Illettrisme,
      PriseEnChargeSpecifique.LanguesEtrangeresAutre,
      PriseEnChargeSpecifique.LanguesEtrangeresAnglais,
      PriseEnChargeSpecifique.HandicapsMoteurs,
      PriseEnChargeSpecifique.DeficienceVisuelle
    ]);
  });

  it('should find "Déficience visuelle" publics accueillis', (): void => {
    const publicsAccueillis: PrisesEnChargeSpecifiques = processPrisesEnChargeSpecifiques(
      {
        'Accueil pour les personnes en situation de handicap': 'cécité'
      },
      MATCHING
    );

    expect(publicsAccueillis).toStrictEqual([PriseEnChargeSpecifique.DeficienceVisuelle]);
  });
});
