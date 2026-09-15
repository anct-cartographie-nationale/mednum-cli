import {
  FETCH_DATA_INCLUSION,
  fetchDataInclusionFromApi,
  WRITE_EXTRACTION,
  writeExtractionInFile
} from '../../features/acquisition-source/index';
import { provide } from '../../libraries/injection/index';

/**
 * Point de concrétisation de la commande : les contrats de l'extraction data.inclusion
 * reçoivent ici, et nulle part ailleurs, leur implémentation.
 */
export const provideDataInclusionImplementations = (): void => {
  provide(FETCH_DATA_INCLUSION, fetchDataInclusionFromApi);
  provide(WRITE_EXTRACTION, writeExtractionInFile);
};
