import { Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { booleanPointInPolygon, point, polygon } from '@turf/turf';
import { type Polygon } from 'geojson';

import { QpvShapesMap } from '../../fields';

const toCheckEveryShapeFor =
  (localisation: Localisation) =>
  (isInShape: boolean, geoShape: Polygon): boolean =>
    isInShape || booleanPointInPolygon(point([localisation.longitude, localisation.latitude]), polygon(geoShape.coordinates));

const isInOneOfQPVShapes = (localisation: Localisation, geoShapes?: Polygon[]): boolean =>
  geoShapes?.reduce(toCheckEveryShapeFor(localisation), false) ?? false;

export const isInQpv =
  (qpvShapesMap: QpvShapesMap) =>
  (codeInsee: string, localisation: Localisation): boolean =>
    qpvShapesMap.has(codeInsee) && isInOneOfQPVShapes(localisation, qpvShapesMap.get(codeInsee));
