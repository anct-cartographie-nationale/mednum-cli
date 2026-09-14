import type { Feature, MultiPolygon, Polygon, Position } from 'geojson';
import type { QpvShapesMap } from '../../../libraries/collectivites/index.js';

export type QpvFeatureProperties = {
  insee_com: string;
};

export type QpvFeature = Feature<MultiPolygon | Polygon, QpvFeatureProperties>;

const toSinglePolygon = (positions: Position[]): Polygon => ({
  coordinates: [positions],
  type: 'Polygon'
});

const multiPolygonToListOfPolygons = (multiPolygon: MultiPolygon): Polygon[] =>
  multiPolygon.coordinates.flatMap((polygonCoordinates: Position[][]): Polygon[] => polygonCoordinates.map(toSinglePolygon));

const isPolygon = (shape: MultiPolygon | Polygon): shape is Polygon => shape.type === 'Polygon';

const polygonsFromShape = (shapeToAdd: MultiPolygon | Polygon, polygons: Polygon[] = []): Polygon[] =>
  isPolygon(shapeToAdd) ? [...polygons, shapeToAdd] : [...polygons, ...multiPolygonToListOfPolygons(shapeToAdd)];

const upsertQpvToShapesMap = (qpvShapesMap: QpvShapesMap, { properties, geometry }: QpvFeature): QpvShapesMap =>
  qpvShapesMap.set(properties.insee_com, polygonsFromShape(geometry, qpvShapesMap.get(properties.insee_com) ?? []));

export const qpvShapesMapFromTransfer = (qpvFeatures: QpvFeature[]): QpvShapesMap =>
  qpvFeatures.reduce(upsertQpvToShapesMap, new Map<string, Polygon[]>());
