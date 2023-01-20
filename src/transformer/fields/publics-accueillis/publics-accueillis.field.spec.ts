/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { PublicAccueilli } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DataSource, LieuxMediationNumeriqueMatching } from '../../input';
import { processPublicsAccueillis } from './publics-accueillis.field';

const MATCHING: LieuxMediationNumeriqueMatching = {
  publics_accueillis: [
    {
      colonnes: [
        'Publics accueillis',
        'Accueil pour les personnes en situation de handicap',
        'Accompagnement de publics spécifiques'
      ],
      termes: ['adultes', 'tout public'],
      cible: 'Adultes'
    },
    {
      colonnes: [
        'Publics accueillis',
        'Accueil pour les personnes en situation de handicap',
        'Accompagnement de publics spécifiques'
      ],
      termes: ['parentalité', 'tout public'],
      cible: 'Familles/enfants'
    },
    {
      colonnes: [
        'Publics accueillis',
        'Accueil pour les personnes en situation de handicap',
        'Accompagnement de publics spécifiques'
      ],
      termes: ['jeunesse', 'tout public'],
      cible: 'Jeunes (16-26 ans)'
    },
    {
      colonnes: [
        'Publics accueillis',
        'Accueil pour les personnes en situation de handicap',
        'Accompagnement de publics spécifiques'
      ],
      termes: ['sénior', 'senior', 'tout public'],
      cible: 'Seniors (+ 65 ans)'
    },
    {
      colonnes: [
        'Publics accueillis',
        'Accueil pour les personnes en situation de handicap',
        'Accompagnement de publics spécifiques'
      ],
      termes: ['surdité', 'tout public'],
      cible: 'Surdité'
    },
    {
      colonnes: [
        'Publics accueillis',
        'Accueil pour les personnes en situation de handicap',
        'Accompagnement de publics spécifiques'
      ],
      termes: ['handicap mental', 'tout public'],
      cible: "Handicaps mentaux : déficiences limitant les activités d'une personne"
    },
    {
      colonnes: [
        'Publics accueillis',
        'Accueil pour les personnes en situation de handicap',
        'Accompagnement de publics spécifiques'
      ],
      termes: ["personnes en situation d'illettrisme", 'tout public'],
      cible: "Personnes en situation d'illettrisme"
    },
    {
      colonnes: [
        'Publics accueillis',
        'Accueil pour les personnes en situation de handicap',
        'Accompagnement de publics spécifiques'
      ],
      termes: ['langue étrangère', 'tout public'],
      cible: 'Public langues étrangères'
    },
    {
      colonnes: [
        'Publics accueillis',
        'Accueil pour les personnes en situation de handicap',
        'Accompagnement de publics spécifiques'
      ],
      termes: ['tout public'],
      cible: 'Uniquement femmes'
    },
    {
      colonnes: [
        'Publics accueillis',
        'Accueil pour les personnes en situation de handicap',
        'Accompagnement de publics spécifiques'
      ],
      termes: ['tout public'],
      cible: 'Handicaps psychiques : troubles psychiatriques donnant lieu à des atteintes comportementales'
    },
    {
      colonnes: [
        'Publics accueillis',
        'Accueil pour les personnes en situation de handicap',
        'Accompagnement de publics spécifiques'
      ],
      termes: ['cécité', 'déficience visuelle', 'tout public'],
      cible: 'Déficience visuelle'
    }
  ]
} as LieuxMediationNumeriqueMatching;

describe('publics accueillis field', (): void => {
  it('should handle empty value', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicsAccueillis({}, MATCHING);

    expect(publicsAccueillis).toStrictEqual([]);
  });

  it('should not find any publics accueillis matching Publics accueillis key', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicsAccueillis(
      {
        'Publics accueillis': ''
      },
      MATCHING
    );

    expect(publicsAccueillis).toStrictEqual([]);
  });

  it('should not find any publics accueillis matching Accueil pour les personnes en situation de handicap key', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicsAccueillis(
      {
        'Accueil pour les personnes en situation de handicap': ''
      },
      MATCHING
    );

    expect(publicsAccueillis).toStrictEqual([]);
  });

  it('should not find any publics accueillis matching Accompagnement de publics spécifiques key', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicsAccueillis(
      {
        'Accompagnement de publics spécifiques': ''
      },
      MATCHING
    );

    expect(publicsAccueillis).toStrictEqual([]);
  });

  it('should find "Adultes" publics accueillis', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicsAccueillis(
      {
        'Publics accueillis': 'adultes'
      },
      MATCHING
    );

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.Adultes]);
  });

  it('should find "Adultes,Familles/enfants" publics accueillis', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicsAccueillis(
      {
        'Publics accueillis': 'adultes, parentalité'
      },
      MATCHING
    );

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.Adultes, PublicAccueilli.FamillesEnfants]);
  });

  it('should find "Familles/enfants" publics accueillis', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicsAccueillis(
      {
        'Publics accueillis': 'parentalité'
      },
      MATCHING
    );

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.FamillesEnfants]);
  });

  it('should find "Seniors (+ 65 ans)" publics accueillis - senior with é', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicsAccueillis(
      {
        'Publics accueillis': 'séniors'
      },
      MATCHING
    );

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.Seniors]);
  });

  it('should find "Seniors (+ 65 ans)" publics accueillis - senior without é', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicsAccueillis(
      {
        'Publics accueillis': 'seniors'
      },
      MATCHING
    );

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.Seniors]);
  });

  it('should find all publics accueillis', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicsAccueillis(
      {
        'Publics accueillis': 'tout public'
      },
      MATCHING
    );

    expect(publicsAccueillis).toStrictEqual([
      PublicAccueilli.Adultes,
      PublicAccueilli.FamillesEnfants,
      PublicAccueilli.Jeunes,
      PublicAccueilli.Seniors,
      PublicAccueilli.Surdite,
      PublicAccueilli.HandicapsMentaux,
      PublicAccueilli.Illettrisme,
      PublicAccueilli.LanguesEtrangeres,
      PublicAccueilli.UniquementFemmes,
      PublicAccueilli.HandicapsPsychiques,
      PublicAccueilli.DeficienceVisuelle
    ]);
  });

  it('should find "Déficience visuelle" publics accueillis', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicsAccueillis(
      {
        'Accueil pour les personnes en situation de handicap': 'cécité'
      },
      MATCHING
    );

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.DeficienceVisuelle]);
  });

  it('should get gratuit default publics accueillis', (): void => {
    const matching: LieuxMediationNumeriqueMatching = {
      publics_accueillis: [
        {
          cible: PublicAccueilli.Adultes
        }
      ]
    } as LieuxMediationNumeriqueMatching;

    const publicsAccueillis: PublicAccueilli[] = processPublicsAccueillis({} as DataSource, matching);

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.Adultes]);
  });
});
