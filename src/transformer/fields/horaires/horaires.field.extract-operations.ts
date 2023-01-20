/* eslint-disable max-lines */

import { OsmDaysOfWeek, OsmOpeningHours } from '@gouvfr-anct/timetable-to-osm-opening-hours';
import { toOsmHours } from '../../to-osm-hours/to-osm-hours';

export type OpeningHoursExtraction = {
  selector: RegExp;
  extract: (osmOpeningHours: OsmOpeningHours[], ...matches: string[]) => OsmOpeningHours[];
};

/* eslint-disable-next-line @typescript-eslint/sort-type-union-intersection-members */
type FrDaysOfWeek = 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi' | 'dimanche';

type FrDayOfWeekMatch = { frDay: FrDaysOfWeek; enDay: OsmDaysOfWeek };

const DAYS_OF_WEEK: FrDayOfWeekMatch[] = [
  { frDay: 'lundi', enDay: 'Mo' },
  { frDay: 'mardi', enDay: 'Tu' },
  { frDay: 'mercredi', enDay: 'We' },
  { frDay: 'jeudi', enDay: 'Th' },
  { frDay: 'vendredi', enDay: 'Fr' },
  { frDay: 'samedi', enDay: 'Sa' },
  { frDay: 'dimanche', enDay: 'Su' }
];

const onlyDaysInRange =
  (start: number, end: number) =>
  (_: FrDayOfWeekMatch, index: number): boolean =>
    index >= start && index <= end;

const toOsmOpeningHours =
  (openingHours: string) =>
  (dayOfWeek: FrDayOfWeekMatch): OsmOpeningHours => ({
    day: dayOfWeek.enDay,
    osmHours: toOsmHours(openingHours)
  });

const dayOfWeekIndex = (startDayRange: string): number =>
  DAYS_OF_WEEK.findIndex((dayOfWeek: FrDayOfWeekMatch): boolean => dayOfWeek.frDay === startDayRange);

const EXTRACT_FOR_SINGLE_DAYS_RANGE: OpeningHoursExtraction = {
  selector:
    /(?<startDayRange>lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s*(?:au)?à?-?\s*(?<endDayRange>lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\D+(?<openingHours>[^/]*)/u,
  extract: (
    osmOpeningHours: OsmOpeningHours[],
    _: string,
    startDayRange: string,
    endDayRange: string,
    openingHours: string
  ): OsmOpeningHours[] => [
    ...osmOpeningHours,
    ...DAYS_OF_WEEK.filter(onlyDaysInRange(dayOfWeekIndex(startDayRange), dayOfWeekIndex(endDayRange))).map(
      toOsmOpeningHours(openingHours)
    )
  ]
};

const EXTRACT_FOR_MULTIPLE_DAYS_RANGE: OpeningHoursExtraction = {
  selector:
    /(?<startDayRange1>lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\sau\s(?<endDayRange1>lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\D+(?<openingHours1>[^/]*).*(?<startDayRange2>lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\sau\s(?<endDayRange2>lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\D+(?<openingHours2>.*)/u,
  extract: (
    osmOpeningHours: OsmOpeningHours[],
    _: string,
    startDayRange1: string,
    endDayRange1: string,
    openingHours1: string,
    startDayRange2: string,
    endDayRange2: string,
    openingHours2: string
  ): OsmOpeningHours[] => [
    ...osmOpeningHours,
    ...DAYS_OF_WEEK.filter(onlyDaysInRange(dayOfWeekIndex(startDayRange1), dayOfWeekIndex(endDayRange1))).map(
      toOsmOpeningHours(openingHours1)
    ),
    ...DAYS_OF_WEEK.filter(onlyDaysInRange(dayOfWeekIndex(startDayRange2), dayOfWeekIndex(endDayRange2))).map(
      toOsmOpeningHours(openingHours2)
    )
  ]
};

const EXTRACT_FOR_LUNDI: OpeningHoursExtraction = {
  selector: /lundi\D*(?<openingHours>[^/]+|.*$)/u,
  extract: (osmOpeningHours: OsmOpeningHours[], _: string, openingHours: string): OsmOpeningHours[] => [
    ...osmOpeningHours,
    { day: 'Mo', osmHours: toOsmHours(openingHours) }
  ]
};

const EXTRACT_FOR_MARDI: OpeningHoursExtraction = {
  selector: /mardi\D*(?<openingHours>[^/]+|.*$)/u,
  extract: (osmOpeningHours: OsmOpeningHours[], _: string, openingHours: string): OsmOpeningHours[] => [
    ...osmOpeningHours,
    { day: 'Tu', osmHours: toOsmHours(openingHours) }
  ]
};

const EXTRACT_FOR_MERCREDI: OpeningHoursExtraction = {
  selector: /mercredi\D*(?<openingHours>[^/]+|.*$)/u,
  extract: (osmOpeningHours: OsmOpeningHours[], _: string, openingHours: string): OsmOpeningHours[] => [
    ...osmOpeningHours,
    { day: 'We', osmHours: toOsmHours(openingHours) }
  ]
};

const EXTRACT_FOR_JEUDI: OpeningHoursExtraction = {
  selector: /jeudi\D*(?<openingHours>[^/]+|.*$)/u,
  extract: (osmOpeningHours: OsmOpeningHours[], _: string, openingHours: string): OsmOpeningHours[] => [
    ...osmOpeningHours,
    { day: 'Th', osmHours: toOsmHours(openingHours) }
  ]
};

const EXTRACT_FOR_VENDREDI: OpeningHoursExtraction = {
  selector: /vendredi\D*(?<openingHours>[^/]+|.*$)/u,
  extract: (osmOpeningHours: OsmOpeningHours[], _: string, openingHours: string): OsmOpeningHours[] => [
    ...osmOpeningHours,
    { day: 'Fr', osmHours: toOsmHours(openingHours) }
  ]
};

const EXTRACT_FOR_SAMEDI: OpeningHoursExtraction = {
  selector: /samedi\D*(?<openingHours>[^/]+|.*$)/u,
  extract: (osmOpeningHours: OsmOpeningHours[], _: string, openingHours: string): OsmOpeningHours[] => [
    ...osmOpeningHours,
    { day: 'Sa', osmHours: toOsmHours(openingHours) }
  ]
};

const EXTRACT_FOR_DIMANCHE: OpeningHoursExtraction = {
  selector: /dimanche\D*(?<openingHours>[^/]+|.*$)/u,
  extract: (osmOpeningHours: OsmOpeningHours[], _: string, openingHours: string): OsmOpeningHours[] => [
    ...osmOpeningHours,
    { day: 'Su', osmHours: toOsmHours(openingHours) }
  ]
};

export const OPENING_HOURS_EXTRACTION: OpeningHoursExtraction[] = [
  EXTRACT_FOR_SINGLE_DAYS_RANGE,
  EXTRACT_FOR_MULTIPLE_DAYS_RANGE,
  EXTRACT_FOR_LUNDI,
  EXTRACT_FOR_MARDI,
  EXTRACT_FOR_MERCREDI,
  EXTRACT_FOR_JEUDI,
  EXTRACT_FOR_VENDREDI,
  EXTRACT_FOR_SAMEDI,
  EXTRACT_FOR_DIMANCHE
];
