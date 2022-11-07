import { OsmDaysOfWeek, OsmOpeningHours, toOsmOpeningHours } from '@gouvfr-anct/timetable-to-osm-opening-hours';
import { Recorder, toOsmHours } from '../../../tools';
import { HinauraLieuMediationNumerique } from '../../helper';
import { InvalidHoursError } from './errors/invalid-hours-error';

/* eslint-disable-next-line @typescript-eslint/sort-type-union-intersection-members */
type HinauraDayFields = 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi' | 'Dimanche';

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
    hinauraLieuMediationNumerique: HinauraLieuMediationNumerique,
    dayField: HinauraDayFields
  ): OsmOpeningHours => {
    recorder.record(dayField, `Format ${hinauraLieuMediationNumerique[dayField]} to osm hours`);

    const fixed: OsmOpeningHours = checkOsmOpeningHoursFormat(
      toOsmHours(hinauraLieuMediationNumerique[dayField]),
      day,
      hinauraLieuMediationNumerique[dayField]
    );

    recorder.fix({ apply: 'convert to OSM hours', before: hinauraLieuMediationNumerique[dayField], after: fixed.osmHours });

    return fixed;
  };

const wrapInArray = (osmOpeningHours: OsmOpeningHours): [] | [OsmOpeningHours] =>
  osmOpeningHours.osmHours === '' ? [] : [osmOpeningHours];

const processDay =
  (recorder: Recorder) =>
  (
    day: OsmDaysOfWeek,
    hinauraLieuMediationNumerique: HinauraLieuMediationNumerique,
    dayField: HinauraDayFields
  ): [] | [OsmOpeningHours] =>
    hinauraLieuMediationNumerique[dayField] === ''
      ? []
      : wrapInArray(toSingleOsmOpeningHours(recorder)(day, hinauraLieuMediationNumerique, dayField));

const osmOpeningHoursString = (osmOpeningHours: string): OsmOpeningHoursString =>
  osmOpeningHours === '' ? NO_OSM_OPENING_HOURS : osmOpeningHours;

export const processHoraires =
  (recorder: Recorder) =>
  (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique): OsmOpeningHoursString => {
    try {
      return osmOpeningHoursString(
        toOsmOpeningHours([
          ...processDay(recorder)('Mo', hinauraLieuMediationNumerique, 'Lundi'),
          ...processDay(recorder)('Tu', hinauraLieuMediationNumerique, 'Mardi'),
          ...processDay(recorder)('We', hinauraLieuMediationNumerique, 'Mercredi'),
          ...processDay(recorder)('Th', hinauraLieuMediationNumerique, 'Jeudi'),
          ...processDay(recorder)('Fr', hinauraLieuMediationNumerique, 'Vendredi'),
          ...processDay(recorder)('Sa', hinauraLieuMediationNumerique, 'Samedi'),
          ...processDay(recorder)('Su', hinauraLieuMediationNumerique, 'Dimanche')
        ])
      );
    } catch (error: unknown) {
      if (error instanceof InvalidHoursError) return NO_OSM_OPENING_HOURS;
      throw error;
    }
  };
