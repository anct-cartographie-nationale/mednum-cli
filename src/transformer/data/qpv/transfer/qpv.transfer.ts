/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { MultiPolygon, Polygon, Position } from '@turf/turf';
import { QpvShapesMap } from '../../../fields';

export type QpvTransfer = {
  fields: {
    geo_shape?: MultiPolygon | Polygon;
    list_com_2023: string;
  };
};

type FieldsWithShape = {
  geo_shape: MultiPolygon | Polygon;
  list_com_2023: string;
};

const toSinglePolygon = (positions: Position[]): Polygon => ({
  coordinates: [positions],
  type: 'Polygon'
});

export const multiPolygonToListOfPolygons = (multiPolygon: MultiPolygon): Polygon[] =>
  multiPolygon.coordinates.flatMap((polygonCoordinates: Position[][]): Polygon[] => polygonCoordinates.map(toSinglePolygon));

const isPolygon = (shape: MultiPolygon | Polygon): shape is Polygon => shape.type === 'Polygon';

const polygonsFromShape = (shapeToAdd: MultiPolygon | Polygon, polygons: Polygon[] = []): Polygon[] =>
  isPolygon(shapeToAdd) ? [...polygons, shapeToAdd] : [...polygons, ...multiPolygonToListOfPolygons(shapeToAdd)];

const toPolygons = (existingQpvTransfer: (MultiPolygon | Polygon)[]): Polygon[] =>
  existingQpvTransfer.reduce(
    (polygons: Polygon[], shapeToAdd: MultiPolygon | Polygon): Polygon[] => polygonsFromShape(shapeToAdd, polygons),
    []
  );

const upsertQpvToShapesMap = (
  existingQpvTransfer: (MultiPolygon | Polygon)[],
  qpvShapesMap: Map<string, Polygon[]>,
  { list_com_2023, geo_shape: shapeToAdd }: FieldsWithShape
): QpvShapesMap =>
  existingQpvTransfer.length === 0
    ? qpvShapesMap.set(list_com_2023, polygonsFromShape(shapeToAdd))
    : qpvShapesMap.set(
        list_com_2023,
        isPolygon(shapeToAdd)
          ? [...toPolygons(existingQpvTransfer), shapeToAdd]
          : [...toPolygons(existingQpvTransfer), ...multiPolygonToListOfPolygons(shapeToAdd)]
      );

const hasGeoShape = (fields: QpvTransfer['fields']): fields is FieldsWithShape => fields.geo_shape != null;

export const qpvShapesMapFromTransfer = (qpvTransfer: QpvTransfer[]): QpvShapesMap =>
  qpvTransfer.reduce(
    (qpvShapesMap: QpvShapesMap, { fields }: QpvTransfer): QpvShapesMap =>
      hasGeoShape(fields)
        ? upsertQpvToShapesMap(qpvShapesMap.get(fields.list_com_2023) ?? [], qpvShapesMap, fields)
        : qpvShapesMap,
    new Map<string, Polygon[]>()
  );
