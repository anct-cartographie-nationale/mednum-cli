import { createFolderIfNotExist, directoryOf } from '../../../libraries/file-system/index';
import type { MergeFormat } from '../domain/index';
import type { ReadRecords, ReadRecordsFromFile, WriteRecords, WriteRecordsToFile } from '../keys/index';

/**
 * La fusion ne connaît que des formats, jamais les bibliothèques qui les lisent ou les
 * écrivent. Le jeu de briques est assemblé au point d'entrée de la commande ; le format a
 * déjà été validé par `filesToMerge` avant d'arriver ici.
 */

export const readRecordsByFormat =
  (readers: Record<MergeFormat, ReadRecordsFromFile>): ReadRecords =>
  (format: MergeFormat): ReadRecordsFromFile =>
    readers[format];

/**
 * Créer le répertoire de destination vaut pour tous les formats : c'est le propre de
 * l'écriture, pas de l'encodage.
 */
export const writeRecordsByFormat =
  (writers: Record<MergeFormat, WriteRecordsToFile>): WriteRecords =>
  (format: MergeFormat): WriteRecordsToFile =>
  (filePath: string, records: unknown[]): void => {
    createFolderIfNotExist(directoryOf(filePath));
    writers[format](filePath, records);
  };
