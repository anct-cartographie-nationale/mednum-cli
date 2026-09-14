import type { QpvShapesMap } from '../../../libraries/collectivites/index.js';
import { fetchQpvFeatures } from '../../../libraries/data-gouv/index.js';
import type { LoadQpvShapes } from '../keys/index.js';
import { type QpvFeature, qpvShapesMapFromTransfer } from './qpv.transfer.js';

export const qpvShapesFromDataGouv: LoadQpvShapes = async (): Promise<QpvShapesMap> =>
  qpvShapesMapFromTransfer((await fetchQpvFeatures()) as QpvFeature[]);
