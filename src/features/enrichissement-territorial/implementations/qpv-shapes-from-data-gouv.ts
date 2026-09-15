import type { QpvShapesMap } from '../../../libraries/collectivites/index';
import { fetchQpvFeatures } from '../../../libraries/data-gouv/index';
import type { LoadQpvShapes } from '../keys/index';
import { type QpvFeature, qpvShapesMapFromTransfer } from './qpv.transfer';

export const qpvShapesFromDataGouv: LoadQpvShapes = async (): Promise<QpvShapesMap> =>
  qpvShapesMapFromTransfer((await fetchQpvFeatures()) as QpvFeature[]);
