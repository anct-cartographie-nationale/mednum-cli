/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Polygon } from '@turf/turf';
import { QpvShapesMap } from '../../../../fields';

export type QpvTransfer = {
  fields: {
    geo_shape?: Polygon;
    code_insee: string;
  };
};

type FieldsWithShape = {
  geo_shape: Polygon;
  code_insee: string;
};

const upsertQpvToShapesMap = (
  existingQpvTransfer: Polygon[],
  qpvShapesMap: Map<string, Polygon[]>,
  { code_insee, geo_shape }: FieldsWithShape
): QpvShapesMap =>
  existingQpvTransfer.length === 0
    ? qpvShapesMap.set(code_insee, [geo_shape])
    : qpvShapesMap.set(code_insee, [...existingQpvTransfer, geo_shape]);

const hasGeoShape = (fields: QpvTransfer['fields']): fields is FieldsWithShape => fields.geo_shape != null;

export const qpvShapesMapFromTransfer = (qpvTransfer: QpvTransfer[]): QpvShapesMap =>
  qpvTransfer.reduce(
    (qpvShapesMap: QpvShapesMap, { fields }: QpvTransfer): QpvShapesMap =>
      hasGeoShape(fields)
        ? upsertQpvToShapesMap(qpvShapesMap.get(fields.code_insee) ?? [], qpvShapesMap, fields)
        : qpvShapesMap,
    new Map<string, Polygon[]>()
  );
