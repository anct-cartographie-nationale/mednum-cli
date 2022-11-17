/* eslint-disable @typescript-eslint/naming-convention */

import { LieuxMediationNumeriqueMatching } from '../../input';
import { Recorder, Report } from '../../report/report';
import { OsmOpeningHoursString, processHoraires } from './horaires.field';

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
    ]
  }
} as LieuxMediationNumeriqueMatching;

describe('horaires field', (): void => {
  it('should process opening hours when only open on monday', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(Report().entry(0))(
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
    const openingHours: OsmOpeningHoursString = processHoraires(Report().entry(0))(
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
    const openingHours: OsmOpeningHoursString = processHoraires(Report().entry(0))(
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
    const openingHours: OsmOpeningHoursString = processHoraires(Report().entry(0))(
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
    const openingHours: OsmOpeningHoursString = processHoraires(Report().entry(0))(
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

  it('should get invalid horaires record in report with a to osm conversion fix', (): void => {
    const report: Report = Report();
    const recorder: Recorder = report.entry(0);

    processHoraires(recorder)(
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

    recorder.commit();

    expect(report.records()).toStrictEqual([
      {
        errors: [
          {
            field: 'Lundi',
            fixes: [
              {
                after: '08:30-12:00,13:30-17:00',
                apply: 'convert to OSM hours',
                before: '8h30 à 12h - 13h30 à 17h'
              }
            ],
            message: 'Format 8h30 à 12h - 13h30 à 17h to osm hours'
          }
        ],
        index: 0
      }
    ]);
  });
});
