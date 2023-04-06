/* eslint-disable @typescript-eslint/no-unnecessary-condition  */
import { OsmDaysOfWeek, OsmOpeningHours, toOsmOpeningHours } from '@gouvfr-anct/timetable-to-osm-opening-hours';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
import { toOsmHours } from '../../to-osm-hours/to-osm-hours';
import { InvalidHoursError } from './errors/invalid-hours-error';
import { NO_OSM_OPENING_HOURS, OsmOpeningHoursString, osmOpeningHoursString } from './process-horaires.field';
import { openingHoursFromWeek } from './opening-hours-from-week';

const OPENING_HOURS_REGEXP: RegExp = /^\d{2}:\d{2}-\d{2}:\d{2}(?:,\d{2}:\d{2}-\d{2}:\d{2})?$/u;

const throwInvalidHours = (osmHours: string, day: OsmDaysOfWeek, hours: string): OsmOpeningHours => {
  throw new InvalidHoursError(osmHours, hours, day);
};

const checkOsmOpeningHoursFormat = (osmHours: string, day: OsmDaysOfWeek, hours: string): OsmOpeningHours =>
  OPENING_HOURS_REGEXP.test(osmHours) || osmHours === '' ? { day, osmHours } : throwInvalidHours(osmHours, day, hours);

const toSingleOsmOpeningHours = (day: OsmDaysOfWeek, hours: string): OsmOpeningHours =>
  checkOsmOpeningHoursFormat(toOsmHours(hours), day, hours);

const wrapInArray = (osmOpeningHours: OsmOpeningHours): [] | [OsmOpeningHours] =>
  osmOpeningHours.osmHours === '' ? [] : [osmOpeningHours];

const processDay = (day: OsmDaysOfWeek, hours?: string): [] | [OsmOpeningHours] =>
  hours == null || hours === '' ? [] : wrapInArray(toSingleOsmOpeningHours(day, hours));

const alreadyHaveOsmOpeningHours = (matching: LieuxMediationNumeriqueMatching, source: DataSource): boolean =>
  matching.horaires?.osm != null && source[matching.horaires.osm] != null;

const openingHoursFromDays = (matching: LieuxMediationNumeriqueMatching, source: DataSource): OsmOpeningHoursString =>
  osmOpeningHoursString(
    toOsmOpeningHours([
      ...(matching.horaires?.jours?.reduce(
        (processedDay: OsmOpeningHours[], currentValue: { colonne: string; osm: OsmDaysOfWeek }): OsmOpeningHours[] => [
          ...processedDay,
          ...processDay(currentValue.osm, source[currentValue.colonne])
        ],
        []
      ) ?? [])
    ])
  );

export const processHoraires = (source: DataSource, matching: LieuxMediationNumeriqueMatching): OsmOpeningHoursString => {
  try {
    if (alreadyHaveOsmOpeningHours(matching, source)) {
      return source[matching.horaires?.osm ?? ''];
    }
    const osmOpeningHours: OsmOpeningHoursString = openingHoursFromDays(matching, source);
    return osmOpeningHours === NO_OSM_OPENING_HOURS && matching.horaires?.semaine != null
      ? openingHoursFromWeek(source[matching.horaires.semaine])
      : osmOpeningHours;
  } catch (error: unknown) {
    if (error instanceof InvalidHoursError) return NO_OSM_OPENING_HOURS;
    throw error;
  }
};
