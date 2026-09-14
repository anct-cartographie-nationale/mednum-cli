import {
  FETCH_REMOTE_SOURCE,
  fetchRemoteSourceWithAxios,
  READ_LOCAL_SOURCE,
  readLocalSourceFromFile
} from '../../features/acquisition-source';
import {
  communesFromGeoApi,
  frrFromObservatoireDesTerritoires,
  LOAD_COMMUNES,
  LOAD_FRR,
  LOAD_QPV_SHAPES,
  qpvShapesFromDataGouv
} from '../../features/enrichissement-territorial';
import { provide } from '../../libraries/injection';

/**
 * Amorce du point d'entrée de la commande transformer : la concrétisation des contrats
 * commence ici. Le reste de la commande rejoindra ce dossier lorsque la capacité de
 * transformation sera à son tour migrée.
 */
export const provideTransformerImplementations = (): void => {
  provide(FETCH_REMOTE_SOURCE, fetchRemoteSourceWithAxios);
  provide(READ_LOCAL_SOURCE, readLocalSourceFromFile);
  provide(LOAD_COMMUNES, communesFromGeoApi);
  provide(LOAD_QPV_SHAPES, qpvShapesFromDataGouv);
  provide(LOAD_FRR, frrFromObservatoireDesTerritoires);
};
