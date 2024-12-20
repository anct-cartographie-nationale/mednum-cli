import { PublicSpecifiquementAdresse } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching } from '../../input';
import { processPublicsSpecifiquementAdresses } from './publics-specifiquement-adresses.field';

const MATCHING: LieuxMediationNumeriqueMatching = {
  publics_specifiquement_adresses: [
    {
      colonnes: ['Publics accueillis', 'Accompagnement de publics spécifiques'],
      termes: ['jeunesse', 'tout public'],
      cible: PublicSpecifiquementAdresse.Jeunes
    },
    {
      colonnes: ['Publics accueillis', 'Accompagnement de publics spécifiques'],
      termes: ['parentalité', 'tout public'],
      cible: PublicSpecifiquementAdresse.FamillesEnfants
    },
    {
      colonnes: ['Publics accueillis', 'Accompagnement de publics spécifiques'],
      termes: ['étudiants', 'tout public'],
      cible: PublicSpecifiquementAdresse.Etudiants
    },
    {
      colonnes: ['Publics accueillis', 'Accompagnement de publics spécifiques'],
      termes: ['sénior', 'senior', 'tout public'],
      cible: PublicSpecifiquementAdresse.Seniors
    },
    {
      colonnes: ['Publics accueillis', 'Accompagnement de publics spécifiques'],
      termes: ['tout public', 'femmes uniquement'],
      cible: PublicSpecifiquementAdresse.Femmes
    }
  ]
} as LieuxMediationNumeriqueMatching;

describe('publics accueillis field', (): void => {
  it('should handle empty value', (): void => {
    const publicsSpecifiquementAdresses: PublicSpecifiquementAdresse[] = processPublicsSpecifiquementAdresses({}, MATCHING);

    expect(publicsSpecifiquementAdresses).toStrictEqual([]);
  });

  it('should not find any publics accueillis matching Publics accueillis key', (): void => {
    const publicsSpecifiquementAdresses: PublicSpecifiquementAdresse[] = processPublicsSpecifiquementAdresses(
      {
        'Publics accueillis': ''
      },
      MATCHING
    );

    expect(publicsSpecifiquementAdresses).toStrictEqual([]);
  });

  it('should not find any publics accueillis matching Accompagnement de publics spécifiques key', (): void => {
    const publicsSpecifiquementAdresses: PublicSpecifiquementAdresse[] = processPublicsSpecifiquementAdresses(
      {
        'Accompagnement de publics spécifiques': ''
      },
      MATCHING
    );

    expect(publicsSpecifiquementAdresses).toStrictEqual([]);
  });

  it('should find "Adultes" publics accueillis', (): void => {
    const publicsSpecifiquementAdresses: PublicSpecifiquementAdresse[] = processPublicsSpecifiquementAdresses(
      {
        'Publics accueillis': 'étudiants'
      },
      MATCHING
    );

    expect(publicsSpecifiquementAdresses).toStrictEqual([PublicSpecifiquementAdresse.Etudiants]);
  });

  it('should find "Adultes,Familles/enfants" publics accueillis', (): void => {
    const publicsSpecifiquementAdresses: PublicSpecifiquementAdresse[] = processPublicsSpecifiquementAdresses(
      {
        'Publics accueillis': 'étudiants, parentalité'
      },
      MATCHING
    );

    expect(publicsSpecifiquementAdresses).toStrictEqual([
      PublicSpecifiquementAdresse.FamillesEnfants,
      PublicSpecifiquementAdresse.Etudiants
    ]);
  });

  it('should find "Familles/enfants" publics accueillis', (): void => {
    const publicsSpecifiquementAdresses: PublicSpecifiquementAdresse[] = processPublicsSpecifiquementAdresses(
      {
        'Publics accueillis': 'parentalité'
      },
      MATCHING
    );

    expect(publicsSpecifiquementAdresses).toStrictEqual([PublicSpecifiquementAdresse.FamillesEnfants]);
  });

  it('should find "Seniors (+ 65 ans)" publics accueillis - senior with é', (): void => {
    const publicsSpecifiquementAdresses: PublicSpecifiquementAdresse[] = processPublicsSpecifiquementAdresses(
      {
        'Publics accueillis': 'séniors'
      },
      MATCHING
    );

    expect(publicsSpecifiquementAdresses).toStrictEqual([PublicSpecifiquementAdresse.Seniors]);
  });

  it('should find "Seniors (+ 65 ans)" publics accueillis - senior without é', (): void => {
    const publicsSpecifiquementAdresses: PublicSpecifiquementAdresse[] = processPublicsSpecifiquementAdresses(
      {
        'Publics accueillis': 'seniors'
      },
      MATCHING
    );

    expect(publicsSpecifiquementAdresses).toStrictEqual([PublicSpecifiquementAdresse.Seniors]);
  });

  it('should find all publics accueillis', (): void => {
    const publicsSpecifiquementAdresses: PublicSpecifiquementAdresse[] = processPublicsSpecifiquementAdresses(
      {
        'Publics accueillis': 'tout public'
      },
      MATCHING
    );

    expect(publicsSpecifiquementAdresses).toStrictEqual([
      PublicSpecifiquementAdresse.Jeunes,
      PublicSpecifiquementAdresse.FamillesEnfants,
      PublicSpecifiquementAdresse.Etudiants,
      PublicSpecifiquementAdresse.Seniors,
      PublicSpecifiquementAdresse.Femmes
    ]);
  });

  it('should find "Déficience visuelle" publics accueillis', (): void => {
    const publicsSpecifiquementAdresses: PublicSpecifiquementAdresse[] = processPublicsSpecifiquementAdresses(
      {
        'Publics accueillis': 'femmes uniquement'
      },
      MATCHING
    );

    expect(publicsSpecifiquementAdresses).toStrictEqual([PublicSpecifiquementAdresse.Femmes]);
  });
});
