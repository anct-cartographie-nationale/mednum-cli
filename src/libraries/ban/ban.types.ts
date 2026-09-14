/**
 * Réponses de la Base Adresse Nationale, telles que l'API les expose.
 */

export type Geometry = {
  type: 'Point';
  coordinates: [number, number];
};

/**
 * housenumber : numéro « à la plaque »
 * street : position « à la voie », placé approximativement au centre de celle-ci
 * locality : lieu-dit
 * municipality : numéro « à la commune »
 */
export type AdresseType = 'housenumber' | 'street' | 'locality' | 'municipality';

export type Properties = {
  label: string;
  score: number;
  housenumber: string;
  id: string;
  type: AdresseType;
  name: string;
  postcode: string;
  citycode: string;
  x: number;
  y: number;
  city: string;
  context: string;
  importance: number;
  street: string;
};

export type Feature = {
  type: 'Feature';
  geometry: Geometry;
  properties: Properties;
};

export type FeatureCollection = {
  type: 'FeatureCollection';
  features: Feature[];
  query: string;
};

export type BanAddressRow = {
  voie: string;
  codePostal: string;
  commune: string;
};

export const BAN_RESULT_FIELDS = [
  'longitude',
  'latitude',
  'result_score',
  'result_housenumber',
  'result_street',
  'result_postcode',
  'result_citycode',
  'result_city',
  'result_label'
] as const;

export type BanResultField = (typeof BAN_RESULT_FIELDS)[number];

export type BanResultRow = BanAddressRow & Record<BanResultField, string>;
