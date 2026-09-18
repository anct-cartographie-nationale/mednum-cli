import type { Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { Polygon } from 'geojson';
import { codeCommuneDe, type IsInQpv, type QpvShapesMap } from '../../../libraries/collectivites';
import { isPointInAnyPolygon } from '../../../libraries/geometry';

const isInOneOfQPVShapes = (localisation: Localisation, geoShapes?: Polygon[]): boolean =>
  geoShapes != null && isPointInAnyPolygon([localisation.longitude, localisation.latitude], geoShapes);

export const isInQpv =
  (qpvShapesMap: QpvShapesMap): IsInQpv =>
  (codeInsee: string, localisation: Localisation): boolean =>
    ((codeCommune: string): boolean =>
      qpvShapesMap.has(codeCommune) && isInOneOfQPVShapes(localisation, qpvShapesMap.get(codeCommune)))(
      codeCommuneDe(codeInsee)
    );
