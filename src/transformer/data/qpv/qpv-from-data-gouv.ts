import axios from 'axios';
import { strFromU8, unzipSync } from 'fflate';
import { type FeatureCollection, type MultiPolygon, type Polygon } from 'geojson';
import { QpvShapesMap } from '../../fields';
import { qpvShapesMapFromTransfer, QpvFeatureProperties } from './transfer';

// Périmètre 2024 des quartiers prioritaires de la politique de la ville (ANCT / SIG Ville).
// Archive ZIP contenant un GeoJSON par territoire ; on lit le fichier combiné en WGS84 (CRS84),
// directement exploitable par turf, qui couvre l'hexagone, la Corse et l'ensemble des Outre-mer.
const QPV_2024_DATASET_URL = 'https://www.data.gouv.fr/api/1/datasets/r/942d4ee8-8142-4556-8ea1-335537ce1119';
const QPV_2024_GEOJSON_ENTRY = 'GEOJSON/QP2024_France_Hexagonale_Outre_Mer_WGS84.geojson';

export const qpvFromDataGouv = async (): Promise<QpvShapesMap> => {
  const archive = (await axios.get<ArrayBuffer>(QPV_2024_DATASET_URL, { responseType: 'arraybuffer' })).data;
  const entry = unzipSync(new Uint8Array(archive))[QPV_2024_GEOJSON_ENTRY];
  if (entry == null) throw new Error(`Entrée introuvable dans l'archive QPV : ${QPV_2024_GEOJSON_ENTRY}`);
  const { features }: FeatureCollection<MultiPolygon | Polygon, QpvFeatureProperties> = JSON.parse(strFromU8(entry));
  return qpvShapesMapFromTransfer(features);
};
