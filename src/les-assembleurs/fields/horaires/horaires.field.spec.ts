/* eslint-disable @typescript-eslint/naming-convention */

import { OsmOpeningHoursString, processHoraires } from './horaires.field';
import { Recorder, Report } from '../../../tools';
import { LesAssembleursLieuMediationNumerique } from '../../helpers';

describe('horaires field', (): void => {
  it('should process opening hours when only open on monday', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(Report().entry(0))({
      'horaires lundi': '8h30-12h / 13h30-17h00',
      'horaires mardi': '',
      'horaires mercredi': '',
      'horaires jeudi': '',
      'horaires vendredi': '',
      'horaires samedi': '',
      'horaires dimanche': ''
    } as LesAssembleursLieuMediationNumerique);
    expect(openingHours).toBe('Mo 08:30-12:00,13:30-17:00');
  });

  it('should process opening hours when open everyday', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(Report().entry(0))({
      'horaires lundi': '8h30 à 12h - 13h30 à 17h',
      'horaires mardi': '8h30 à 12h - 13h30 à 17h',
      'horaires mercredi': '8h30 à 12h - 13h30 à 17h',
      'horaires jeudi': '8h30 à 12h - 13h30 à 17h',
      'horaires vendredi': '8h30 à 12h - 13h30 à 17h',
      'horaires samedi': '8h30 à 12h - 13h30 à 17h',
      'horaires dimanche': '',
      'Horaires ouverture': '-----'
    } as LesAssembleursLieuMediationNumerique);
    expect(openingHours).toBe('Mo-Sa 08:30-12:00,13:30-17:00');
  });

  it('should process complex opening hours', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(Report().entry(0))({
      'horaires lundi': '8h00 à 12h',
      'horaires mardi': '8h00 à 12h',
      'horaires mercredi': '8h30 à 12h - 13h30 à 17h',
      'horaires jeudi': '8h30 à 12h - 13h30 à 16h',
      'horaires vendredi': '8h30 à 12h - 13h30 à 17h',
      'horaires samedi': '',
      'horaires dimanche': '8h30 à 17h'
    } as LesAssembleursLieuMediationNumerique);
    expect(openingHours).toBe('Mo,Tu 08:00-12:00; We,Fr 08:30-12:00,13:30-17:00; Th 08:30-12:00,13:30-16:00; Su 08:30-17:00');
  });

  it('should process opening hours with days off marked with Fermé', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(Report().entry(0))({
      'horaires lundi': 'Fermé',
      'horaires mardi': '9h à 12h et 14h à 17h',
      'horaires mercredi': '9h à 12h et 14h à 17h',
      'horaires jeudi': '9h à 12h et 14h à 17h',
      'horaires vendredi': '9h à 12h et 14h à 17h',
      'horaires samedi': '9h-12h',
      'horaires dimanche': 'Fermé'
    } as LesAssembleursLieuMediationNumerique);
    expect(openingHours).toBe('Tu-Fr 09:00-12:00,14:00-17:00; Sa 09:00-12:00');
  });

  it('should process opening hours with no opening hours', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(Report().entry(0))({
      'horaires lundi': '',
      'horaires mardi': '',
      'horaires mercredi': '',
      'horaires jeudi': '',
      'horaires vendredi': '',
      'horaires samedi': '',
      'horaires dimanche': ''
    } as LesAssembleursLieuMediationNumerique);
    expect(openingHours).toBeUndefined();
  });

  it('should get invalid horaires record in report with a to osm conversion fix', (): void => {
    const report: Report = Report();
    const recorder: Recorder = report.entry(0);
    processHoraires(recorder)({
      'horaires lundi': '8h30 à 12h - 13h30 à 17h',
      'horaires mardi': '',
      'horaires mercredi': '',
      'horaires jeudi': '',
      'horaires vendredi': '',
      'horaires samedi': '',
      'horaires dimanche': ''
    } as LesAssembleursLieuMediationNumerique);
    recorder.commit();
    expect(report.records()).toStrictEqual([
      {
        errors: [
          {
            field: 'horaires lundi',
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

  it('should same opening hours every day from monday to saturday when specified with "Lundi au samedi"', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(Report().entry(0))({
      'Horaires ouverture': 'Lundi au samedi de 9h à 19h'
    } as LesAssembleursLieuMediationNumerique);

    expect(openingHours).toStrictEqual('Mo-Sa 09:00-19:00');
  });

  it('should same opening hours every day from monday to friday when specified with "Lundi au vendredi"', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(Report().entry(0))({
      'Horaires ouverture': 'Lundi au vendredi de 9h à 19h'
    } as LesAssembleursLieuMediationNumerique);

    expect(openingHours).toStrictEqual('Mo-Fr 09:00-19:00');
  });

  it('should same opening hours every day from monday to friday when specified with "Lundi-vendredi"', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(Report().entry(0))({
      'Horaires ouverture': 'Lundi-vendredi 9h30-17h30'
    } as LesAssembleursLieuMediationNumerique);

    expect(openingHours).toStrictEqual('Mo-Fr 09:30-17:30');
  });

  it('should same opening hours on enumerated days with "lundi, mardi et jeudi"', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(Report().entry(0))({
      'Horaires ouverture': 'Il y a des créneaux accès libre au public les lundi, mardi et jeudi de 16h30 à 18h.'
    } as LesAssembleursLieuMediationNumerique);

    expect(openingHours).toStrictEqual('Mo-Th 16:30-18:00; We off');
  });

  it('should not get any opening hours when Horaires ouverture field is set to -----', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(Report().entry(0))({
      'Horaires ouverture': '-----'
    } as LesAssembleursLieuMediationNumerique);

    expect(openingHours).toBeUndefined();
  });

  it('should not get any opening hours when Horaires ouverture field do not contains any day of week', (): void => {
    const openingHours: OsmOpeningHoursString = processHoraires(Report().entry(0))({
      'Horaires ouverture': 'Ateliers sur réservation et accès libre'
    } as LesAssembleursLieuMediationNumerique);

    expect(openingHours).toBeUndefined();
  });
});
