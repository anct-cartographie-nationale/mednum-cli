import {
  LIST_FILES,
  listFilesWithGlob,
  READ_RECORDS,
  readRecordsFromFile,
  WRITE_RECORDS,
  writeRecordsToFile
} from '../../features/fusion';
import { provide } from '../../libraries/injection';

/**
 * Point de concrétisation de la commande : c'est ici, et nulle part ailleurs, que les contrats
 * déclarés par la capacité de fusion reçoivent une implémentation.
 */
export const provideFusionnerImplementations = (): void => {
  provide(LIST_FILES, listFilesWithGlob);
  provide(READ_RECORDS, readRecordsFromFile);
  provide(WRITE_RECORDS, writeRecordsToFile);
};
