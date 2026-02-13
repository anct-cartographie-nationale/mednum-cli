import { OsmDaysOfWeek, OsmOpeningHours, fromTimetableOsmOpeningHours } from '@gouvfr-anct/timetable-to-osm-opening-hours';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
import { toOsmHours } from '../../to-osm-hours/to-osm-hours';
import { InvalidHoursError } from './errors/invalid-hours-error';
import { NO_OSM_OPENING_HOURS, OsmOpeningHoursString, osmOpeningHoursString } from './process-horaires.field';
import { openingHoursFromWeek } from './opening-hours-from-week';

const SEMAINE_IMPAIRE: string = 'week 1-53/2 ';
const SEMAINE_PAIRE: string = 'week 2-52/2 ';

const OPENING_HOURS_REGEXP: RegExp = /^\d{2}:\d{2}-\d{2}:\d{2}(?:,\d{2}:\d{2}-\d{2}:\d{2})?$/;

const OSM_OPENING_HOURS_TRIVIAL_REGEXP: RegExp =
  /(?:24\/7|(?:(?:Mo|Tu|We|Th|Fr|Sa|Su)(?:[-,](?:Mo|Tu|We|Th|Fr|Sa|Su))?\s)?(?:[0-1]\d|2[0-3]):[0-5]\d-(?:[0-1]\d|2[0-3]):[0-5]\d.*)/;

const fixOsmHours = (osmHours?: string): string =>
  osmHours
    ?.replace(/,\s/g, ',')
    .replace(/(\d)h(\d)/g, '$1:$2')
    .replace(/(\d{1,2})\s*:\s*(\d{2})/g, '$1:$2')
    .replace(/\b(\d):(\d{2})\b/g, '0$1:$2') ?? '';

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

const openingHoursFromDays = (matching: LieuxMediationNumeriqueMatching, source: DataSource): OsmOpeningHoursString =>
  osmOpeningHoursString(
    fromTimetableOsmOpeningHours([
      ...(matching.horaires?.jours?.reduce(
        (
          processedDay: OsmOpeningHours[],
          currentValue: { colonne: string[] | string; osm: OsmDaysOfWeek }
        ): OsmOpeningHours[] => [
          ...processedDay,
          ...processDay(
            currentValue.osm,
            Array.isArray(currentValue.colonne)
              ? currentValue.colonne.map((col: string): string | undefined => source[col]?.toString()).join(', ')
              : (source[currentValue.colonne]?.toString() ?? '')
          )
        ],
        []
      ) ?? [])
    ])
  );

const applyWeek = (osmHoraires: string, weekOpening: string): OsmOpeningHoursString =>
  weekOpening === 'Semaine paire' ? SEMAINE_PAIRE.concat(osmHoraires) : SEMAINE_IMPAIRE.concat(osmHoraires);

const applyWeekOpeningIfAny = (osmHoraires?: string, weekOpening?: string): OsmOpeningHoursString =>
  weekOpening != null && osmHoraires != null ? applyWeek(osmHoraires, weekOpening) : osmHoraires;

const alreadyHaveOsmOpeningHours = (matching: LieuxMediationNumeriqueMatching, source: DataSource): boolean =>
  matching.horaires?.osm != null &&
  source[matching.horaires.osm] != null &&
  OSM_OPENING_HOURS_TRIVIAL_REGEXP.test(fixOsmHours(source[matching.horaires.osm]?.toString() ?? ''));

export const processHoraires = (source: DataSource, matching: LieuxMediationNumeriqueMatching): OsmOpeningHoursString => {
  try {
    if (alreadyHaveOsmOpeningHours(matching, source)) {
      return applyWeekOpeningIfAny(
        fixOsmHours(source[matching.horaires?.osm ?? '']?.toString()),
        source[matching.semaine_ouverture?.colonne ?? '']?.toString()
      );
    }
    const osmOpeningHours: OsmOpeningHoursString = openingHoursFromDays(matching, source);

    return osmOpeningHours === NO_OSM_OPENING_HOURS && (matching.horaires?.semaine != null || matching.horaires?.osm != null)
      ? openingHoursFromWeek(source[matching.horaires?.semaine ?? matching.horaires?.osm ?? '']?.toString())
      : osmOpeningHours;
  } catch (error: unknown) {
    if (error instanceof InvalidHoursError) return NO_OSM_OPENING_HOURS;
    throw error;
  }
};
