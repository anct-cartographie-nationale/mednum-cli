import { describe, it, expect } from 'vitest';
import { LieuxMediationNumeriqueMatching } from '../../input';
import { OsmOpeningHoursString } from './process-horaires.field';
import { processHoraires } from './horaires.field';

const matching: LieuxMediationNumeriqueMatching = {
  horaires: {
    jours: [
      {
        colonne: 'Lundi',
        osm: 'Mo'
      },
      {
        colonne: 'Mardi',
        osm: 'Tu'
      },
      {
        colonne: 'Mercredi',
        osm: 'We'
      },
      {
        colonne: 'Jeudi',
        osm: 'Th'
      },
      {
        colonne: 'Vendredi',
        osm: 'Fr'
      },
      {
        colonne: 'Samedi',
        osm: 'Sa'
      },
      {
        colonne: 'Dimanche',
        osm: 'Su'
      }
    ],
    semaine: 'Horaires ouverture',
    osm: 'OSM'
  },
  semaine_ouverture: {
    colonne: 'ouverture'
  }
} as LieuxMediationNumeriqueMatching;

describe('horaires field', (): void => {
  it('should process opening hours when only open on monday', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        Lundi: '8h30 à 12h - 13h30 à 17h',
        Mardi: '',
        Mercredi: '',
        Jeudi: '',
        Vendredi: '',
        Samedi: '',
        Dimanche: ''
      },
      matching
    );

    expect(openingHours).toBe('Mo 08:30-12:00,13:30-17:00');
  });

  it('should process opening hours when open everyday', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        Lundi: '8h30 à 12h - 13h30 à 17h',
        Mardi: '8h30 à 12h - 13h30 à 17h',
        Mercredi: '8h30 à 12h - 13h30 à 17h',
        Jeudi: '8h30 à 12h - 13h30 à 17h',
        Vendredi: '8h30 à 12h - 13h30 à 17h',
        Samedi: '8h30 à 12h - 13h30 à 17h',
        Dimanche: '8h30 à 12h - 13h30 à 17h'
      },
      matching
    );

    expect(openingHours).toBe('08:30-12:00,13:30-17:00');
  });

  it('should process complex opening hours', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        Lundi: '8h00 à 12h',
        Mardi: '8h00 à 12h',
        Mercredi: '8h30 à 12h - 13h30 à 17h',
        Jeudi: '8h30 à 12h - 13h30 à 16h',
        Vendredi: '8h30 à 12h - 13h30 à 17h',
        Samedi: '',
        Dimanche: '8h30 à 17h'
      },
      matching
    );

    expect(openingHours).toBe('Mo,Tu 08:00-12:00; We,Fr 08:30-12:00,13:30-17:00; Th 08:30-12:00,13:30-16:00; Su 08:30-17:00');
  });

  it('should process opening hours with days off marked with Fermé', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        Lundi: 'Fermé',
        Mardi: '9h à 12h et 14h à 17h',
        Mercredi: '9h à 12h et 14h à 17h',
        Jeudi: '9h à 12h et 14h à 17h',
        Vendredi: '9h à 12h et 14h à 17h',
        Samedi: '9h-12h',
        Dimanche: 'Fermé'
      },
      matching
    );

    expect(openingHours).toBe('Tu-Fr 09:00-12:00,14:00-17:00; Sa 09:00-12:00');
  });

  it('should process opening hours with no opening hours', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        Lundi: '',
        Mardi: '',
        Mercredi: '',
        Jeudi: '',
        Vendredi: '',
        Samedi: '',
        Dimanche: ''
      },
      matching
    );

    expect(openingHours).toBeUndefined();
  });

  it('should get same opening hours every day from monday to saturday when specified with "Lundi au samedi"', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'Lundi au samedi de 9h à 19h'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Sa 09:00-19:00');
  });

  it('should get same opening hours every day from monday to friday when specified with "Lundi au vendredi"', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'Lundi au vendredi de 9h à 19h'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Fr 09:00-19:00');
  });

  it('should get same opening hours every day from monday to thursday when specified with "Du lundi au jeudi"', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'Du lundi au jeudi : 08:30-12:00 et 13:30-16:30'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Th 08:30-12:00,13:30-16:30');
  });

  it('should get same opening hours every day from monday to friday when specified with "Lundi-vendredi"', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'Lundi-vendredi 9h30-17h30'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Fr 09:30-17:30');
  });

  it('should get same opening hours on enumerated days with "lundi, mardi et jeudi"', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'Il y a des créneaux accès libre au public les lundi, mardi et jeudi de 16h30 à 18h.'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Th 16:30-18:00; We off');
  });

  it('should not get any opening hours when Horaires ouverture field is set to -----', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': '-----'
      },
      matching
    );

    expect(openingHours).toBeUndefined();
  });

  it('should not get any opening hours when Horaires ouverture field do not contains any day of week', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'Ateliers sur réservation et accès libre'
      },
      matching
    );

    expect(openingHours).toBeUndefined();
  });

  it('should get opening hours for the only day specified', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'Mercredi 9h30-12h30'
      },
      matching
    );

    expect(openingHours).toBe('We 09:30-12:30');
  });

  it('should get opening hours for list of days with different opening hours', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'Mercredi : 15:00-17:00 / Vendredi : 16:00-18:00 /  Samedi : 10:30 - 12:00'
      },
      matching
    );

    expect(openingHours).toBe('We 15:00-17:00; Fr 16:00-18:00; Sa 10:30-12:00');
  });

  it('should same opening hours on enumerated days with "Lundi, mardi, jeudi et vendredi"', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'Lundi, mardi, jeudi et vendredi : 09:00-12:00 et 13:30-16:15 / Mercredi et samedi : 09:00-12:00'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Fr 09:00-12:00,13:30-16:15; We,Sa 09:00-12:00');
  });

  it('should get opening days for two days with different hours', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'mercredi de 16 h à 18 h et le samedi de 10 h à 12 h'
      },
      matching
    );

    expect(openingHours).toBe('We 16:00-18:00; Sa 10:00-12:00');
  });

  it('should merge multiple opening days ranges', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture':
          'SANS RENDEZ-VOUS du lundi au vendredi  : 08h30 - 12h30 / AVEC RENDEZ-VOUS du lundi au jeudi : 12h30 - 16h15'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Th 08:30-16:15; Fr 08:30-12:30');
  });

  it('should get same opening hours every day from wednesday to saturday an another opening hours on tuesday and thursday', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'Mardi : 14:00-19:00 / Mercredi au samedi : 10:00-12:00 et 14:00-18:00 / Jeudi : 14:00-18:00'
      },
      matching
    );

    expect(openingHours).toBe('We-Sa 10:00-12:00,14:00-18:00; Tu 14:00-19:00');
  });

  it('should get opening days from single letter', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'Sessions libre du fablab les V14h-21h et S 10h-13h / L au V 8h30-19h'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Th 08:30-19:00; Fr 08:30-21:00; Sa 10:00-13:00');
  });

  it('should remove 1er mardi matin du mois', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': '1er mardi matin du mois'
      },
      matching
    );

    expect(openingHours).toBeUndefined();
  });

  it('should get opening days with unexpected slashes', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'lundi : 8h30-12h/14h-18h, mardi au vendredi : 8h30-12h/14h-17h30'
      },
      matching
    );

    expect(openingHours).toBe('Tu-Fr 08:30-12:00,14:00-17:30; Mo 08:30-12:00,14:00-18:00');
  });

  it('should remove text in parenthesis', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': '9h30-12h 14h-16h (sauf le lundi matin / mardi)'
      },
      matching
    );

    expect(openingHours).toBeUndefined();
  });

  it('should detect multiple spaces opening hours separation', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture':
          'du lundi au vendredi : de 8h30 à 12h et de 13h30 à 17h30    samedi : de 14h à 17h30   fermeture en août'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Fr 08:30-12:00,13:30-17:30; Sa 14:00-17:30');
  });

  it('should replace / as times range separator', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'LUNDI 9H30/12H30'
      },
      matching
    );

    expect(openingHours).toBe('Mo 09:30-12:30');
  });

  it('should replace . with / as days separator', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture':
          'lundi au jeudi de 8h à 12h et de 13h30 à 17h30. le mercredi de 10h à 12h et de 13h30 à 17h30. le vendredi de 8h à 12h et de 13h30 à 16h30'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Th 08:00-12:00,13:30-17:30; Fr 08:00-12:00,13:30-16:30');
  });

  it('should replace , with / as days separator', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'lundi 13:00 17:00 , du mardi au vendredi 08:30 12:30 - 13:30 17:00'
      },
      matching
    );

    expect(openingHours).toBe('Tu-Fr 08:30-12:30,13:30-17:00; Mo 13:00-17:00');
  });

  it('should get multiples days separated with spaces', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'mardi 17h30-19h mercredi 9h-12h 14h18h jeudi 18h-19h30 vendredi 17h30-19h samedi 09h-12h 14h-17h'
      },
      matching
    );

    expect(openingHours).toBe('Tu,Fr 17:30-19:00; We 09:00-12:00,14:00-18:00; Th 18:00-19:30; Sa 09:00-12:00,14:00-17:00');
  });

  it('should format when sauf is used as days separator', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'du lundi au vendredi, de 9h à 12h et de 13h30 à 17h30, sauf le mercredi, de 9h à 12h'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Fr 09:00-12:00,13:30-17:30');
  });

  it('should format when au followed by multiple spaces', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'LUNDI 13:00 17:00 , DU MARDI AU VENDREDI    08:00 - 17:00'
      },
      matching
    );

    expect(openingHours).toBe('Tu-Fr 08:00-17:00; Mo 13:00-17:00');
  });

  it('should format when au is after hours', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': '9h-19h du lundi au samedi'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Sa 09:00-19:00');
  });

  it('should format 2 characters days', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'lu au ve 09:00 19:00'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Fr 09:00-19:00');
  });

  it('should get range when use à instead of au', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'lundi 10h30-12h 13h30-17h / mardi à jeudi 9h-12h  13h30-18h / vendredi 9h-12h  16h-17h'
      },
      matching
    );

    expect(openingHours).toBe('Tu-Th 09:00-12:00,13:30-18:00; Mo 10:30-12:00,13:30-17:00; Fr 09:00-12:00,16:00-17:00');
  });

  it('should replace range separators used as times separators', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture':
          'Lundi: 9h00 à 12h00 / 14h à 17h00 - Mardi 9h00 à 12h00 / 14h à 17h00 - Mercredi 9h00 à 12h00 - Jeudi 9h00 à 12h00 / 14h à 17h00 - Vendredi 9h00 à 12h00 / 14h à 17h00'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Fr 09:00-12:00,14:00-17:00; We 09:00-12:00');
  });

  it('should replace range separators used as times separators without h next to hour', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'lundi au vendredi 9h/12/ 13h30-17h30'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Fr 09:00-12:00,13:30-17:30');
  });

  it('should replace du with days separator', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture':
          'lundi de 13 h 30 à 17 h 30 - du mardi au vendredi : de 9 h 00 à 12 h 00 et de 13 h 30 h à 17 h 30'
      },
      matching
    );

    expect(openingHours).toBe('Tu-Fr 09:00-12:00,13:30-17:30; Mo 13:30-17:30');
  });

  it('should days separator used as times separator when time without h', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'mardi 14-18 / mercredi 10-12/14-18 / jeudi 14-17 / vendredi 14-17 / samedi 10-12/14-17'
      },
      matching
    );

    expect(openingHours).toBe('Th,Fr 14:00-17:00; Tu 14:00-18:00; We 10:00-12:00,14:00-18:00; Sa 10:00-12:00,14:00-17:00');
  });

  it('should format slash surrounded with spaces time separator', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'lundi / et mardi 9h-12h / 14h-16h30'
      },
      matching
    );

    expect(openingHours).toBe('Mo,Tu 09:00-12:00,14:00-16:30');
  });

  it('should use "," days separator', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'lundi de 13h30 à 16h30, vendredi de 15h30 à 18h30'
      },
      matching
    );

    expect(openingHours).toBe('Mo 13:30-16:30; Fr 15:30-18:30');
  });

  it('should remove phone numbers', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'lundi sur rendez vous au 03.21.89.04.66'
      },
      matching
    );

    expect(openingHours).toBeUndefined();
  });

  it('should use "le" as days separator', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'du mardi au vendredi 14h-18h le samedi de 9h-12h et de 14h-17h'
      },
      matching
    );

    expect(openingHours).toBe('Tu-Fr 14:00-18:00; Sa 09:00-12:00,14:00-17:00');
  });

  it('should use "---" as days separator', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture':
          'le jeudi et vendredi : 09:30-11:30 --- en autonomie : du lundi au jeudi : 09:00-11:30 et 14:00-17:30'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Th 09:00-11:30,14:00-17:30; Fr 09:30-11:30');
  });

  it('should remove "1 fois" to avoid unexpected numbers', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'fermeture exceptionnelle le vendredi après midi 1 fois par trimestre'
      },
      matching
    );

    expect(openingHours).toBeUndefined();
  });

  it('should format when "au" is after hours followed by a description', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': '9h à 17h30 du lundi au vendredi. Fermé pendant les vacances de Noël.'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Fr 09:00-17:30');
  });

  it('should format when times ranges are separated with multiple spaces', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'du lundi au vendredi   9h30 - 12h   14h - 18h'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Fr 09:30-12:00,14:00-18:00');
  });

  it('should format when "au" is after hours followed by another day', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': '8h-12h du Lundi au Samedi et  13h30-17h30 le mercredi'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Sa 08:00-12:00; We 08:00-12:00,13:30-17:30');
  });

  it('should format hours without minutes and h', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'lundi 14 18 h mardi 9 12 h et 14 21 h'
      },
      matching
    );

    expect(openingHours).toBe('Mo 14:00-18:00; Tu 09:00-12:00,14:00-21:00');
  });

  it('should add range separator before "au" starting with "du"', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'lundi de 13h30 à 18h du mardi au vendredi de 9h à 12 et de 13h30 à 18h'
      },
      matching
    );

    expect(openingHours).toBe('Tu-Fr 09:00-12:00,13:30-18:00; Mo 13:30-18:00');
  });

  it('should fix "0" instead of "à" typo', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'du lundi au vendredi de 9h 0 12h et de 13h45 0 17h15'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Fr 09:00-12:00,13:45-17:15');
  });

  it('should add days separators instead of multiple spaces', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'lundi 16h00-19h00   mardi 10h00-12h00   mercredi 14h00-19h00'
      },
      matching
    );

    expect(openingHours).toBe('Mo 16:00-19:00; Tu 10:00-12:00; We 14:00-19:00');
  });

  it('should add day separator after a single digit hour', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'lundi 14h-7h vendredi 9h-12h'
      },
      matching
    );

    expect(openingHours).toBe('Mo 14:00-07:00; Fr 09:00-12:00');
  });

  it('should insert spaces between hours and day abbreviations when missing', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'Mar : 14h-19hMer :14h-18hJeu : 14h-18hVen : 14h-18h'
      },
      matching
    );

    expect(openingHours).toBe('We-Fr 14:00-18:00; Tu 14:00-19:00');
  });

  it('should normalize and return OSM hours when leading zeros are missing in AM times', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        OSM: 'Mo-Th 9:00-16:00'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Th 09:00-16:00');
  });

  it('should return OSM hours when opening hours are already in OSM format', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'Mo-Fr 09:00-11:45,13:30-16:30',
        OSM: 'Mo-Fr 09:00-11:45,13:30-16:30'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Fr 09:00-11:45,13:30-16:30');
  });

  it('should return OSM hours when words "entre" and "et" are present', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'mardi entre 10h et 12h'
      },
      matching
    );

    expect(openingHours).toBe('Tu 10:00-12:00');
  });

  it('should normalize and return OSM hours from no OSM formatted opening hours', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'lundi 13h30 -17h30 mardi 8h -12h et 13h30- 17h30 jeudi 8h-12h et 13h30 -17h30 vendredi 8h-12h',
        OSM: 'lundi 13h30 -17h30 mardi 8h -12h et 13h30- 17h30 jeudi 8h-12h et 13h30 -17h30 vendredi 8h-12h'
      },
      matching
    );

    expect(openingHours).toBe('Tu,Th 08:00-12:00,13:30-17:30; Mo 13:30-17:30; Fr 08:00-12:00');
  });

  it('Should format complex schedule with off days', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'Ouvert du Lundi au Vendredi de 8h30 à 12h00 et de 13h00 à 16h30Samedi et Dimanche fermé '
      },
      matching
    );

    expect(openingHours).toBe('Mo-Fr 08:30-12:00,13:00-16:30');
  });

  it('should format ">" day separator', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture':
          '> mardi : 14h-18h30 > mercredi : 10h-18h30 > jeudi : 14h-18h30 > vendredi : 10h-18h30 > samedi : 10h-18h  -  horaires pendant les vacances scolaires : > mardi : 14h-18h > mercredi : 10h-12h et 14h-18h > jeudi : 14h-18h > vendredi : 10h-12h et 14h-18h > samedi : 10h-12h et 14h-18h  -  la médiathèque est fermée les jours fériés.'
      },
      matching
    );

    expect(openingHours).toBe('Tu,Th 14:00-18:30; We,Fr 10:00-18:30; Sa 10:00-18:00');
  });

  it('should get osm hours without transformation', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      { OSM: 'Tu,Th 14:00-18:30; We,Fr 10:00-18:30; Sa 10:00-18:00' },
      matching
    );

    expect(openingHours).toBe('Tu,Th 14:00-18:30; We,Fr 10:00-18:30; Sa 10:00-18:00');
  });

  it('should fix extra spaces in osm hours', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      { OSM: 'Tu, Th, Fr 13:30-18:00; We, Sa 10:30-12:30, 13:30-18:00' },
      matching
    );

    expect(openingHours).toBe('Tu,Th,Fr 13:30-18:00; We,Sa 10:30-12:30,13:30-18:00');
  });

  it('should fix h instead of : in osm hours', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires({ OSM: 'Mo-Fr 14h00-19h00;Sa 14h00-18h00' }, matching);

    expect(openingHours).toBe('Mo-Fr 14:00-19:00;Sa 14:00-18:00');
  });

  it('should replace unexpected charactere like + and newline by single comma', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture': 'Lundi : 08:30 - 12:30 - 13:30 - 17:30 \n + Mardi : 09:30 - 13:30 / 14:30 - 18:30'
      },
      matching
    );

    expect(openingHours).toBe('Mo 08:30-12:30,13:30-17:30; Tu 09:30-13:30,14:30-18:30');
  });

  it('should replace unexpected charactere with more complexity syntaxe', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture':
          'Lundi : 08:30 - 12:30 - 13:30 - 17:30 \n' +
          ' + Mardi : 08:30 - 12:30 / 13:30 - 17:30 \n' +
          ' + Mercredi : 08:30 - 12:30 / 13:30 - 17:30 \n' +
          ' + Jeudi : 08:30 - 12:30 / 13:30 - 17:30 Vendredi : 08:30 - 12:30 / 13:30 - 17:30 Samedi : 14:00 -15:00'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Fr 08:30-12:30,13:30-17:30; Sa 14:00-15:00');
  });

  it('should replace / by : only when format is XX/XX', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture':
          'Lundi : 08:30 - 12:30 - 13:30 - 16:30 \n' +
          'Mardi : 08:30 - 12:30 / 13:30 - 16:30 Mercredi : 08:30 - 12:30 / 13:30 - 16:30 \n' +
          'Jeudi : 08:30 - 12:30 / 13/30 - 16:30 Vendredi : 08:30 - 12:30 / 13:30 – 16:30'
      },
      matching
    );

    expect(openingHours).toBe('Mo-Fr 08:30-12:30,13:30-16:30');
  });

  it('should replace unexpected charactere with more complexity syntaxe but different than before', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      {
        'Horaires ouverture':
          'Mardi : 9h - 12h / 14h - 18h\n' +
          'Mercredi : 9h - 12h / 14h - 18h\n' +
          'Jeudi : 9h - 12h / 14h - 18h\n' +
          'Vendredi : 9h - 13h'
      },
      matching
    );

    expect(openingHours).toBe('Tu-Th 09:00-12:00,14:00-18:00; Fr 09:00-13:00');
  });

  it('should get osm hours with add of week opening impaire', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      { OSM: 'Mo 09:30-12:30,13:30-15:30; PH off', ouverture: 'Semaine impaire' },
      matching
    );

    expect(openingHours).toBe('week 1-53/2 Mo 09:30-12:30,13:30-15:30; PH off');
  });

  it('should get osm hours with add of week opening paire', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(
      { OSM: 'Mo 09:30-12:30,13:30-15:30; PH off', ouverture: 'Semaine paire' },
      matching
    );

    expect(openingHours).toBe('week 2-52/2 Mo 09:30-12:30,13:30-15:30; PH off');
  });
});
