import {
  EXCLUDED_LIEUX_IDS,
  excludeById,
  IS_INCLUDED,
  LOAD_LIEUX,
  loadLieuxFromSource,
  SAVE_DEDUPLICATION,
  type SaveDeduplication,
  saveInFiles,
  saveWithApi
} from '../../features/deduplication';
import { writePublicationMetadataInFile } from '../../features/publication';
import { provide } from '../../libraries/injection';
import { consoleJournal, JOURNAL } from '../../libraries/journal';
import type { DedupliquerOptions } from './dedupliquer.options';

/**
 * Point de concrétisation de la commande. C'est ici que se décide la destination des données
 * dédupliquées, et ici que la capacité de publication est branchée sur le besoin que la
 * déduplication a déclaré : les deux capacités ne se connaissent pas.
 */
const saveDeduplication = (dedupliquerOptions: DedupliquerOptions): SaveDeduplication =>
  dedupliquerOptions.cartographieNationaleApiKey == null
    ? saveInFiles(
        {
          name: dedupliquerOptions.sourceName,
          path: dedupliquerOptions.outputDirectory,
          territoire: dedupliquerOptions.territory
        },
        writePublicationMetadataInFile
      )
    : saveWithApi({
        url: dedupliquerOptions.cartographieNationaleApiUrl,
        key: dedupliquerOptions.cartographieNationaleApiKey
      });

export const provideDedupliquerImplementations = (dedupliquerOptions: DedupliquerOptions): void => {
  provide(JOURNAL, consoleJournal);
  provide(LOAD_LIEUX, loadLieuxFromSource);
  provide(IS_INCLUDED, excludeById(EXCLUDED_LIEUX_IDS));
  provide(SAVE_DEDUPLICATION, saveDeduplication(dedupliquerOptions));
};
