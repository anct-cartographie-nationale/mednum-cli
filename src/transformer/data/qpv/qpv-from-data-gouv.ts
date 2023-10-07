import axios from 'axios';
import { QpvShapesMap } from '../../fields';
import { qpvShapesMapFromTransfer } from '../qpv';

export const qpvFromDataGouv = async (): Promise<QpvShapesMap> =>
  qpvShapesMapFromTransfer(
    (await axios.get('https://www.data.gouv.fr/fr/datasets/r/90b18bce-ad62-40bd-bb8e-4ac9cf980c24')).data
  );
