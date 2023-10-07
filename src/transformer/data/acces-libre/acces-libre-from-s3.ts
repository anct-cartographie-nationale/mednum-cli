import axios from 'axios';
import { Erp } from '../../fields';

export const accesLibreFromS3 = async (): Promise<Erp[]> =>
  (await axios.get('https://anct-carto-client-feature-les-assembleurs.s3.eu-west-3.amazonaws.com/acceslibre.json')).data;
