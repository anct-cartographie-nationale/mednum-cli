import {
  LIST_FILES,
  READ_RECORDS,
  readCsvRecordsFromFile,
  readJsonRecordsFromFile,
  readRecordsByFormat,
  WRITE_RECORDS,
  writeCsvRecordsToFile,
  writeJsonRecordsToFile,
  writeRecordsByFormat
} from '../../features/fusion/index';
import { findFiles } from '../../libraries/file-system/index';
import { provide } from '../../libraries/injection/index';

/**
 * Point de concrétisation de la commande : c'est ici, et nulle part ailleurs, que les contrats
 * déclarés par la capacité de fusion reçoivent une implémentation. Prendre en charge un format
 * de plus tient en une entrée de plus dans ces tables.
 */
export const provideFusionnerImplementations = (): void => {
  provide(LIST_FILES, findFiles);
  provide(
    READ_RECORDS,
    readRecordsByFormat({
      '.csv': readCsvRecordsFromFile,
      '.json': readJsonRecordsFromFile
    })
  );
  provide(
    WRITE_RECORDS,
    writeRecordsByFormat({
      '.csv': writeCsvRecordsToFile,
      '.json': writeJsonRecordsToFile
    })
  );
};
