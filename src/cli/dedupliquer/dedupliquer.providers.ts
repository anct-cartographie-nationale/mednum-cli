import {
  EXCLUDED_LIEUX_IDS,
  excludeById,
  IS_INCLUDED,
  LOAD_LIEUX,
  loadLieuxFromSource,
  SAVE_DEDUPLICATION,
  saveInFiles
} from '../../features/deduplication/index.js';
import { writePublicationMetadataInFile } from '../../features/publication/index.js';
import { provide } from '../../libraries/injection/index.js';
import { consoleJournal, JOURNAL } from '../../libraries/journal/index.js';
import type { DedupliquerOptions } from './dedupliquer.options.js';

/**
 * Point de concrétisation de la commande. C'est ici que la capacité de publication est
 * branchée sur le besoin que la déduplication a déclaré : les deux capacités ne se
 * connaissent pas.
 */
export const provideDedupliquerImplementations = (dedupliquerOptions: DedupliquerOptions): void => {
  provide(JOURNAL, consoleJournal);
  provide(LOAD_LIEUX, loadLieuxFromSource);
  provide(IS_INCLUDED, excludeById(EXCLUDED_LIEUX_IDS));
  provide(
    SAVE_DEDUPLICATION,
    saveInFiles(
      {
        name: dedupliquerOptions.sourceName,
        path: dedupliquerOptions.outputDirectory,
        territoire: dedupliquerOptions.territory
      },
      writePublicationMetadataInFile
    )
  );
};
