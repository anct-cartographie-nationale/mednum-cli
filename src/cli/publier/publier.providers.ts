import {
  DATASET_REPOSITORY,
  datasetRepositoryOnDataGouv,
  READ_PUBLICATION_METADATA,
  READ_RESSOURCE_RECORDS,
  readPublicationMetadataFromFile,
  readRessourceRecordsFromFile
} from '../../features/publication';
import type { Api } from '../../libraries/http';
import { provide } from '../../libraries/injection';

/**
 * Point de concrétisation de la commande : les contrats de la publication reçoivent ici, et
 * nulle part ailleurs, leur implémentation. C'est aussi ici que data.gouv est choisi comme
 * entrepôt de destination.
 */
export const providePublierImplementations = (api: Api): void => {
  provide(DATASET_REPOSITORY, datasetRepositoryOnDataGouv(api));
  provide(READ_PUBLICATION_METADATA, readPublicationMetadataFromFile);
  provide(READ_RESSOURCE_RECORDS, readRessourceRecordsFromFile);
};
