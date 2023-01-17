import { OsmDaysOfWeek, OsmOpeningHours, toOsmOpeningHours } from '@gouvfr-anct/timetable-to-osm-opening-hours';
import { mergeMultipleHoursRanges } from '../../merge-hours-ranges/merge-hours-ranges';
import { OPENING_HOURS_EXTRACTION, OpeningHoursExtraction } from './horaires.field.extract-operations';
import { HORAIRES_FIELD_CLEAN_OPERATIONS, HorairesFieldCleanOperation } from './horaires.field.clean-operations';
import { NO_OSM_OPENING_HOURS, OsmOpeningHoursString, osmOpeningHoursString } from './process-horaires.field';

type DayWithOsmHours = { osmHours: string; day: OsmDaysOfWeek };

type DayWithOsmHoursToMerge = { osmHours: string[]; day: OsmDaysOfWeek };

const OSM_DAYS_OF_WEEK: OsmDaysOfWeek[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const toMergedHoursRanges = (wideHoursRange: string, hoursRange: string, index: number): string =>
  index === 0 ? hoursRange : mergeMultipleHoursRanges(wideHoursRange, hoursRange);

const mergeDuplicatedDaysOpeningHours = (daysToMerge: string[]): string => daysToMerge.reduce(toMergedHoursRanges, '');

const byDayOfWeek = (
  valueA: { day: OsmDaysOfWeek; osmHours: string },
  valueB: { day: OsmDaysOfWeek; osmHours: string }
): number => OSM_DAYS_OF_WEEK.indexOf(valueA.day) - OSM_DAYS_OF_WEEK.indexOf(valueB.day);

const toDayWithOsmHours = (openingHoursToMerge: DayWithOsmHoursToMerge): DayWithOsmHours => ({
  osmHours: mergeDuplicatedDaysOpeningHours(openingHoursToMerge.osmHours),
  day: openingHoursToMerge.day
});

const matchingDay =
  (day: string) =>
  (openingHoursToMerge: DayWithOsmHoursToMerge): boolean =>
    openingHoursToMerge.day === day;

const isMatchingDay = (dayWithOsmHoursToMerge: DayWithOsmHoursToMerge[], day: string): boolean =>
  dayWithOsmHoursToMerge.find(matchingDay(day)) != null;

const appendOsmHoursToMerge = (
  dayWithOsmHoursToMerge: DayWithOsmHoursToMerge[],
  dayWithOsmHours: DayWithOsmHours
): DayWithOsmHoursToMerge[] => [
  ...dayWithOsmHoursToMerge.filter(
    (openingHoursToMerge: DayWithOsmHoursToMerge): boolean => openingHoursToMerge.day !== dayWithOsmHours.day
  ),
  {
    day: dayWithOsmHours.day,
    osmHours: [dayWithOsmHours.osmHours, ...(dayWithOsmHoursToMerge.find(matchingDay(dayWithOsmHours.day))?.osmHours ?? [])]
  }
];

const addNewOsmHoursToMerge = (
  dayWithOsmHoursToMerge: DayWithOsmHoursToMerge[],
  dayWithOsmHours: DayWithOsmHours
): DayWithOsmHoursToMerge[] => [
  ...dayWithOsmHoursToMerge,
  {
    osmHours: [dayWithOsmHours.osmHours],
    day: dayWithOsmHours.day
  }
];

const toDayWithOsmHoursToMerge = (
  dayWithOsmHoursToMerge: DayWithOsmHoursToMerge[],
  dayWithOsmHours: DayWithOsmHours
): DayWithOsmHoursToMerge[] =>
  isMatchingDay(dayWithOsmHoursToMerge, dayWithOsmHours.day)
    ? appendOsmHoursToMerge(dayWithOsmHoursToMerge, dayWithOsmHours)
    : addNewOsmHoursToMerge(dayWithOsmHoursToMerge, dayWithOsmHours);

const toExtractedOsmOpeningHours =
  (singleStringOpeningHours: string) =>
  (previousValue: OsmOpeningHours[], openingHoursExtraction: OpeningHoursExtraction): OsmOpeningHours[] => {
    if (!openingHoursExtraction.selector.test(singleStringOpeningHours)) return previousValue;
    const matches: RegExpMatchArray | null = openingHoursExtraction.selector.exec(singleStringOpeningHours);
    return openingHoursExtraction.extract(previousValue, ...(matches == null ? [] : matches));
  };

const processOpeningHours = (singleStringOpeningHours?: string): OsmOpeningHours[] =>
  singleStringOpeningHours == null
    ? []
    : OPENING_HOURS_EXTRACTION.reduce(toExtractedOsmOpeningHours(singleStringOpeningHours), [])
        .reduce(toDayWithOsmHoursToMerge, [])
        .map(toDayWithOsmHours)
        .sort(byDayOfWeek);

const isValidOdmHours = (osmOpeningHours: OsmOpeningHoursString): boolean =>
  /(?:Mo|Tu|We|Th|Fr|Sa|Su)\s?;|(?:Mo|Tu|We|Th|Fr|Sa|Su)\s?$/gu.test(osmOpeningHours ?? '');

export const openingHoursFromWeek = (horairesSingleField?: string): OsmOpeningHoursString =>
  ((singleStringOpeningHours: OsmOpeningHoursString): OsmOpeningHoursString =>
    isValidOdmHours(singleStringOpeningHours) ? NO_OSM_OPENING_HOURS : singleStringOpeningHours)(
    osmOpeningHoursString(
      toOsmOpeningHours(
        processOpeningHours(
          HORAIRES_FIELD_CLEAN_OPERATIONS.reduce(
            (horaires: OsmOpeningHoursString, cleanOperation: HorairesFieldCleanOperation): string | undefined =>
              horaires?.replace(cleanOperation.selector, cleanOperation.fix),
            horairesSingleField?.toLowerCase().trim()
          )
        )
      )
    )
  );
