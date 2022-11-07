import { OsmDaysOfWeek } from '@gouvfr-anct/timetable-to-osm-opening-hours';

export class InvalidHoursError extends Error {
  constructor(public readonly osmHours: string, public readonly hours: string, public readonly day: OsmDaysOfWeek) {
    super(`osm opening hours '${osmHours}' from '${hours}' on day '${day}' is invalid`);
  }
}
