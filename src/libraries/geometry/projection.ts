import proj4 from 'proj4';

const LAMBERT_93 = 'EPSG:9793';
const WGS_84 = 'EPSG:4326';

proj4.defs(
  LAMBERT_93,
  '+proj=lcc +lat_0=46.5 +lon_0=3 +lat_1=49 +lat_2=44 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
);

/**
 * Projette des coordonnées Lambert-93 vers WGS84. Certaines sources publient leurs
 * coordonnées dans la projection légale française plutôt qu'en degrés décimaux.
 */
export const lambert93ToWgs84 = ([x, y]: [number, number]): [number | undefined, number | undefined] => {
  const [longitude, latitude]: number[] = proj4(LAMBERT_93, WGS_84, [x, y]);
  return [longitude, latitude];
};
