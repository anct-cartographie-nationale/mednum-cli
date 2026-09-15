import type { QpvShapesMap } from '../../../libraries/collectivites';
import { fetchQpvFeatures } from '../../../libraries/data-gouv';
import type { LoadQpvShapes } from '../keys';
import { type QpvFeature, qpvShapesMapFromTransfer } from './qpv.transfer';

export const qpvShapesFromDataGouv: LoadQpvShapes = async (): Promise<QpvShapesMap> =>
  qpvShapesMapFromTransfer((await fetchQpvFeatures()) as QpvFeature[]);
