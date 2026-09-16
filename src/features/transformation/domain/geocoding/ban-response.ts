import { Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { Feature, FeatureCollection } from '../../../../libraries/ban';
import type { Coordinates } from '../../../../libraries/geometry';

export type BanResponse = { data: FeatureCollection };

/**
 * Une panne du géocodeur n'est pas une absence de résultat. La seconde apprend quelque chose —
 * la BAN ne connaît pas cette adresse — la première n'apprend rien. Les confondre inscrirait au
 * cache, le temps d'une coupure, des milliers d'échecs datés du jour, que la règle de fraîcheur
 * figerait ensuite une semaine.
 */
export const GEOCODING_UNAVAILABLE: 'geocoding_unavailable' = 'geocoding_unavailable';

export type BatchGeocoding = BanResponse | typeof GEOCODING_UNAVAILABLE | null;

export const scoreOf = (feature?: Feature): number => feature?.properties.score ?? 0;

export const coordinatesOf = (feature: Feature): Coordinates => ({
  latitude: feature.geometry.coordinates[1] ?? 0,
  longitude: feature.geometry.coordinates[0] ?? 0
});

export const localisationOf = (feature: Feature): Localisation => Localisation(coordinatesOf(feature));

export const toLocalisation = (response: BanResponse): Localisation =>
  Localisation({
    latitude: response.data.features[0]?.geometry?.coordinates[1] ?? 0,
    longitude: response.data.features[0]?.geometry?.coordinates[0] ?? 0
  });
