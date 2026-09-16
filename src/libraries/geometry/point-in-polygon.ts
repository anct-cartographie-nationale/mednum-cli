import { booleanPointInPolygon, point, polygon } from '@turf/turf';
import type { Polygon } from 'geojson';

/**
 * Calcul géométrique pur : le point donné tombe-t-il dans l'un des polygones ?
 */
export const isPointInAnyPolygon = (coordinates: [number, number], polygons: Polygon[]): boolean =>
  polygons.some((geoShape: Polygon): boolean => booleanPointInPolygon(point(coordinates), polygon(geoShape.coordinates)));
