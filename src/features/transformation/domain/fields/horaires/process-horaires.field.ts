type NoOsmOpeningHours = undefined;

export type OsmOpeningHoursString = NoOsmOpeningHours | string;

export const NO_OSM_OPENING_HOURS: NoOsmOpeningHours = undefined;

export const osmOpeningHoursString = (osmOpeningHours: string): OsmOpeningHoursString =>
  osmOpeningHours === '' ? NO_OSM_OPENING_HOURS : osmOpeningHours;
