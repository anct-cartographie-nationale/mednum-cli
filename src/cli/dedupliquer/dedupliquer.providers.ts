import type { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import {
  EXCLUDED_LIEUX_IDS,
  excludeById,
  IS_INCLUDED,
  LOAD_LIEUX,
  loadLieuxFromCsvFile,
  loadLieuxFromJsonFile,
  loadLieuxFromPaginatedApi,
  SAVE_DEDUPLICATION,
  saveInFiles
} from '../../features/deduplication';
import { writePublicationMetadataInFile } from '../../features/publication';
import { provide } from '../../libraries/injection';
import { consoleJournal, JOURNAL } from '../../libraries/journal';
import { composeLoader, whenExtension, whenRemote } from './dedupliquer.loader';
import type { DedupliquerOptions } from './dedupliquer.options';

/**
 * Point de concrétisation de la commande. C'est ici que la capacité de publication est
 * branchée sur le besoin que la déduplication a déclaré : les deux capacités ne se
 * connaissent pas.
 *
 * C'est ici également que se compose le chargement des lieux. La déduplication demande des
 * lieux, sans savoir d'où ils viennent ; l'ordre des règles ci-dessous décide qu'une adresse
 * distante l'emporte sur son extension.
 */
export const provideDedupliquerImplementations = (dedupliquerOptions: DedupliquerOptions): void => {
  provide(JOURNAL, consoleJournal);
  provide(
    LOAD_LIEUX,
    composeLoader<SchemaLieuMediationNumerique>([
      whenRemote(loadLieuxFromPaginatedApi),
      whenExtension('.json', loadLieuxFromJsonFile),
      whenExtension('.csv', loadLieuxFromCsvFile)
    ])
  );
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
