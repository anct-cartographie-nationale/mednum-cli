import { type Feature, type MultiPolygon, type Polygon, type Position } from 'geojson';
import { QpvShapesMap } from '../../../fields';

export type QpvTransfer = {
  geo_shape?: Feature<MultiPolygon | Polygon>;
  list_com_2023: string;
};

type FieldsWithShape = {
  geo_shape: Feature<MultiPolygon | Polygon>;
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
    ? qpvShapesMap.set(list_com_2023, polygonsFromShape(shapeToAdd.geometry))
    : qpvShapesMap.set(
        list_com_2023,
        isPolygon(shapeToAdd.geometry)
          ? [...toPolygons(existingQpvTransfer), shapeToAdd.geometry]
          : [...toPolygons(existingQpvTransfer), ...multiPolygonToListOfPolygons(shapeToAdd.geometry)]
      );

const hasGeoShape = (qpv: QpvTransfer): qpv is FieldsWithShape => qpv.geo_shape != null;

export const qpvShapesMapFromTransfer = (qpvTransfer: QpvTransfer[]): QpvShapesMap => {
  console.log(qpvTransfer);
  return qpvTransfer.reduce(
    (qpvShapesMap: QpvShapesMap, qpv: QpvTransfer): QpvShapesMap =>
      hasGeoShape(qpv) ? upsertQpvToShapesMap(qpvShapesMap.get(qpv.list_com_2023) ?? [], qpvShapesMap, qpv) : qpvShapesMap,
    new Map<string, Polygon[]>()
  );
};
