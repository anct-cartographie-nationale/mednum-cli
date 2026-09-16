const EARTH_RADIUS_IN_METERS = 6_371_000;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

export type Coordinates = { latitude: number; longitude: number };

/**
 * Distance orthodromique entre deux points, en mètres. La formule de haversine suffit ici :
 * elle assimile la Terre à une sphère, ce qui l'écarte de quelques mètres sur des milliers de
 * kilomètres — sans conséquence pour comparer deux adresses qu'on espère voisines.
 */
export const distanceInMeters = (from: Coordinates, to: Coordinates): number => {
  const deltaLatitude: number = toRadians(to.latitude - from.latitude);
  const deltaLongitude: number = toRadians(to.longitude - from.longitude);
  const halfChord: number =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(deltaLongitude / 2) ** 2;

  return 2 * EARTH_RADIUS_IN_METERS * Math.asin(Math.min(1, Math.sqrt(halfChord)));
};
