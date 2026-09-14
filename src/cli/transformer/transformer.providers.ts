import {
  FETCH_REMOTE_SOURCE,
  fetchRemoteSourceWithAxios,
  READ_LOCAL_SOURCE,
  readLocalSourceFromFile
} from '../../features/acquisition-source';
import { provide } from '../../libraries/injection';

/**
 * Amorce du point d'entrée de la commande transformer : la concrétisation des contrats
 * commence ici. Le reste de la commande rejoindra ce dossier lorsque la capacité de
 * transformation sera à son tour migrée.
 */
export const provideAcquisitionSourceImplementations = (): void => {
  provide(FETCH_REMOTE_SOURCE, fetchRemoteSourceWithAxios);
  provide(READ_LOCAL_SOURCE, readLocalSourceFromFile);
};
