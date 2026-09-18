import {
  FETCH_ACCES_LIBRE,
  fetchAccesLibreFromDataGouv,
  WRITE_ACCES_LIBRE,
  writeAccesLibreInFile
} from '../../features/acquisition-source';
import { provide } from '../../libraries/injection';

export const provideAccesLibreImplementations = (): void => {
  provide(FETCH_ACCES_LIBRE, fetchAccesLibreFromDataGouv);
  provide(WRITE_ACCES_LIBRE, writeAccesLibreInFile);
};
