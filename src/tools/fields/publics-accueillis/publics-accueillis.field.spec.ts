/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { PublicAccueilli } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching } from '../../input';
import { processPublicAccueilli } from './publics-accueillis.field';

const matching: LieuxMediationNumeriqueMatching = {
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
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli({}, matching);

    expect(publicsAccueillis).toStrictEqual([]);
  });

  it('should not find any publics accueillis matching Publics accueillis key', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli(
      {
        'Publics accueillis': ''
      },
      matching
    );

    expect(publicsAccueillis).toStrictEqual([]);
  });

  it('should not find any publics accueillis matching Accueil pour les personnes en situation de handicap key', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli(
      {
        'Accueil pour les personnes en situation de handicap': ''
      },
      matching
    );

    expect(publicsAccueillis).toStrictEqual([]);
  });

  it('should not find any publics accueillis matching Accompagnement de publics spécifiques key', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli(
      {
        'Accompagnement de publics spécifiques': ''
      },
      matching
    );

    expect(publicsAccueillis).toStrictEqual([]);
  });

  it('should find "Adultes" publics accueillis', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli(
      {
        'Publics accueillis': 'adultes'
      },
      matching
    );

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.Adultes]);
  });

  it('should find "Adultes,Familles/enfants" publics accueillis', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli(
      {
        'Publics accueillis': 'adultes, parentalité'
      },
      matching
    );

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.Adultes, PublicAccueilli.FamillesEnfants]);
  });

  it('should find "Familles/enfants" publics accueillis', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli(
      {
        'Publics accueillis': 'parentalité'
      },
      matching
    );

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.FamillesEnfants]);
  });

  it('should find "Seniors (+ 65 ans)" publics accueillis - senior with é', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli(
      {
        'Publics accueillis': 'séniors'
      },
      matching
    );

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.Seniors]);
  });

  it('should find "Seniors (+ 65 ans)" publics accueillis - senior without é', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli(
      {
        'Publics accueillis': 'seniors'
      },
      matching
    );

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.Seniors]);
  });

  it('should find all publics accueillis', (): void => {
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli(
      {
        'Publics accueillis': 'tout public'
      },
      matching
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
    const publicsAccueillis: PublicAccueilli[] = processPublicAccueilli(
      {
        'Accueil pour les personnes en situation de handicap': 'cécité'
      },
      matching
    );

    expect(publicsAccueillis).toStrictEqual([PublicAccueilli.DeficienceVisuelle]);
  });
});
