import { OsmDaysOfWeek, OsmOpeningHours, toOsmOpeningHours } from '@gouvfr-anct/timetable-to-osm-opening-hours';
import { LesAssembleursLieuMediationNumerique } from '../../helpers';
import { InvalidHoursError } from './errors/invalid-hours-error';
import { processHorairesSingleField } from '../../../tools/process-horaires-single-field';
import { NO_OSM_OPENING_HOURS, osmOpeningHoursString, OsmOpeningHoursString } from '../../../tools/process-horaires.field';
import { Recorder } from '../../../mednum/transformer/report';
import { toOsmHours } from '../../../mednum/transformer/to-osm-hours/to-osm-hours';

type LesAssembleursDayFields =
  /* eslint-disable-next-line @typescript-eslint/sort-type-union-intersection-members */
  | 'horaires lundi'
  | 'horaires mardi'
  | 'horaires mercredi'
  | 'horaires jeudi'
  | 'horaires vendredi'
  | 'horaires samedi'
  | 'horaires dimanche'
  | 'Horaires ouverture';

const OPENING_HOURS_REGEXP: RegExp = /^\d{2}:\d{2}-\d{2}:\d{2}(?:,\d{2}:\d{2}-\d{2}:\d{2})?$/u;

const throwInvalidHours = (osmHours: string, day: OsmDaysOfWeek, hours: string): OsmOpeningHours => {
  throw new InvalidHoursError(osmHours, hours, day);
};

const checkOsmOpeningHoursFormat = (osmHours: string, day: OsmDaysOfWeek, hours: string): OsmOpeningHours =>
  OPENING_HOURS_REGEXP.test(osmHours) || osmHours === '' ? { day, osmHours } : throwInvalidHours(osmHours, day, hours);

const toSingleOsmOpeningHours =
  (recorder: Recorder) =>
  (
    day: OsmDaysOfWeek,
    lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique,
    dayField: LesAssembleursDayFields
  ): OsmOpeningHours => {
    recorder.record(dayField, `Format ${lesAssembleursLieuMediationNumerique[dayField]} to osm hours`);

    const fixed: OsmOpeningHours = checkOsmOpeningHoursFormat(
      toOsmHours(lesAssembleursLieuMediationNumerique[dayField]),
      day,
      lesAssembleursLieuMediationNumerique[dayField]
    );

    recorder.fix({
      apply: 'convert to OSM hours',
      before: lesAssembleursLieuMediationNumerique[dayField],
      after: fixed.osmHours
    });

    return fixed;
  };

const wrapInArray = (osmOpeningHours: OsmOpeningHours): [] | [OsmOpeningHours] =>
  osmOpeningHours.osmHours === '' ? [] : [osmOpeningHours];

const processDay =
  (recorder: Recorder) =>
  (
    day: OsmDaysOfWeek,
    lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique,
    dayField: LesAssembleursDayFields
  ): [] | [OsmOpeningHours] =>
    /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */
    lesAssembleursLieuMediationNumerique[dayField] == null || lesAssembleursLieuMediationNumerique[dayField] === ''
      ? []
      : wrapInArray(toSingleOsmOpeningHours(recorder)(day, lesAssembleursLieuMediationNumerique, dayField));

export const processHoraires =
  (recorder: Recorder) =>
  (lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique): OsmOpeningHoursString => {
    try {
      const osmOpeningHours: OsmOpeningHoursString = osmOpeningHoursString(
        toOsmOpeningHours([
          ...processDay(recorder)('Mo', lesAssembleursLieuMediationNumerique, 'horaires lundi'),
          ...processDay(recorder)('Tu', lesAssembleursLieuMediationNumerique, 'horaires mardi'),
          ...processDay(recorder)('We', lesAssembleursLieuMediationNumerique, 'horaires mercredi'),
          ...processDay(recorder)('Th', lesAssembleursLieuMediationNumerique, 'horaires jeudi'),
          ...processDay(recorder)('Fr', lesAssembleursLieuMediationNumerique, 'horaires vendredi'),
          ...processDay(recorder)('Sa', lesAssembleursLieuMediationNumerique, 'horaires samedi'),
          ...processDay(recorder)('Su', lesAssembleursLieuMediationNumerique, 'horaires dimanche')
        ])
      );

      if (osmOpeningHours === NO_OSM_OPENING_HOURS) {
        return processHorairesSingleField(lesAssembleursLieuMediationNumerique['Horaires ouverture']);
      }

      return osmOpeningHours;
    } catch (error: unknown) {
      if (error instanceof InvalidHoursError) return NO_OSM_OPENING_HOURS;
      throw error;
    }
  };
