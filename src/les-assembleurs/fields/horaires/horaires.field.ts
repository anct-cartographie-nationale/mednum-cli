/* eslint-disable @typescript-eslint/sort-type-union-intersection-members,max-lines-per-function,max-statements,@typescript-eslint/prefer-regexp-exec */

import { OsmDaysOfWeek, OsmOpeningHours, toOsmOpeningHours } from '@gouvfr-anct/timetable-to-osm-opening-hours';
import { Recorder, toOsmHours } from '../../../tools';
import { LesAssembleursLieuMediationNumerique } from '../../helpers';
import { InvalidHoursError } from './errors/invalid-hours-error';

type LesAssembleursDayFields =
  | 'horaires lundi'
  | 'horaires mardi'
  | 'horaires mercredi'
  | 'horaires jeudi'
  | 'horaires vendredi'
  | 'horaires samedi'
  | 'horaires dimanche'
  | 'Horaires ouverture';

type NoOsmOpeningHours = undefined;

export type OsmOpeningHoursString = NoOsmOpeningHours | string;

const NO_OSM_OPENING_HOURS: NoOsmOpeningHours = undefined;

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
    lesAssembleursLieuMediationNumerique[dayField] == null || lesAssembleursLieuMediationNumerique[dayField] === ''
      ? []
      : wrapInArray(toSingleOsmOpeningHours(recorder)(day, lesAssembleursLieuMediationNumerique, dayField));

const osmOpeningHoursString = (osmOpeningHours: string): OsmOpeningHoursString =>
  osmOpeningHours === '' ? NO_OSM_OPENING_HOURS : osmOpeningHours;

const DAYS_OF_WEEK: { frDay: string; enDay: OsmDaysOfWeek }[] = [
  { frDay: 'lundi', enDay: 'Mo' },
  { frDay: 'mardi', enDay: 'Tu' },
  { frDay: 'mercredi', enDay: 'We' },
  { frDay: 'jeudi', enDay: 'Th' },
  { frDay: 'vendredi', enDay: 'Fr' },
  { frDay: 'samedi', enDay: 'Sa' },
  { frDay: 'dimanche', enDay: 'Su' }
];

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
        let openingDays: OsmDaysOfWeek[] = [];

        if (lesAssembleursLieuMediationNumerique['Horaires ouverture'] == null) {
          return NO_OSM_OPENING_HOURS;
        }

        if (lesAssembleursLieuMediationNumerique['Horaires ouverture'] === '-----') {
          return NO_OSM_OPENING_HOURS;
        }

        const regexHyphen = /(?<startDay>\w+)-(?<endDay>\w+)/u;
        if (regexHyphen.test(lesAssembleursLieuMediationNumerique['Horaires ouverture'])) {
          const matches = lesAssembleursLieuMediationNumerique['Horaires ouverture']?.match(regexHyphen);
          const startDay = matches?.groups?.['startDay'];
          const endDay = matches?.groups?.['endDay'];
          const startDayIndex = DAYS_OF_WEEK.findIndex((dayOfWeek) => dayOfWeek.frDay === startDay?.toLocaleLowerCase());
          const endDayIndex = DAYS_OF_WEEK.findIndex((dayOfWeek) => dayOfWeek.frDay === endDay?.toLocaleLowerCase());
          openingDays = DAYS_OF_WEEK.filter((_, index) => index >= startDayIndex && index <= endDayIndex).map(
            (dayOfWeek) => dayOfWeek.enDay
          );
        }

        const regexAu = /(?<startDay>\w+)\sau\s(?<endDay>\w+)/u;
        if (regexAu.test(lesAssembleursLieuMediationNumerique['Horaires ouverture'])) {
          const matches = lesAssembleursLieuMediationNumerique['Horaires ouverture']?.match(regexAu);
          const startDay = matches?.groups?.['startDay'];
          const endDay = matches?.groups?.['endDay'];
          const startDayIndex = DAYS_OF_WEEK.findIndex((dayOfWeek) => dayOfWeek.frDay === startDay?.toLocaleLowerCase());
          const endDayIndex = DAYS_OF_WEEK.findIndex((dayOfWeek) => dayOfWeek.frDay === endDay?.toLocaleLowerCase());
          openingDays = DAYS_OF_WEEK.filter((_, index) => index >= startDayIndex && index <= endDayIndex).map(
            (dayOfWeek) => dayOfWeek.enDay
          );
        }

        const regexEnumerated = /(?<day1>\w+),\s(?<day2>\w+)\set\s(?<day3>\w+)/u;
        if (regexEnumerated.test(lesAssembleursLieuMediationNumerique['Horaires ouverture'])) {
          const matches = lesAssembleursLieuMediationNumerique['Horaires ouverture']?.match(regexEnumerated);
          const day1 = matches?.groups?.['day1'];
          const day2 = matches?.groups?.['day2'];
          const day3 = matches?.groups?.['day3'];

          openingDays = DAYS_OF_WEEK.filter((dayOfWeek) => [day1, day2, day3].includes(dayOfWeek.frDay)).map(
            (dayOfWeek) => dayOfWeek.enDay
          );
        }

        console.log('here', lesAssembleursLieuMediationNumerique['Horaires ouverture'], openingDays);

        if (openingDays.length === 0) {
          throw new Error('Should not be there');
        }

        return osmOpeningHoursString(
          toOsmOpeningHours(
            openingDays.map((openingDay: OsmDaysOfWeek) =>
              toSingleOsmOpeningHours(recorder)(openingDay, lesAssembleursLieuMediationNumerique, 'Horaires ouverture')
            )
          )
        );
      }

      return osmOpeningHours;
    } catch (error: unknown) {
      if (error instanceof InvalidHoursError) return NO_OSM_OPENING_HOURS;
      throw error;
    }
  };
