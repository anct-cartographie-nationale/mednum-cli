import {
  ECRIRE_ANNUAIRE,
  ecrireAnnuaireDansUnFichier,
  LIRE_LES_LIEUX,
  lireLesLieuxDepuisDesFichiers
} from '../../features/acquisition-source';
import { provide } from '../../libraries/injection';

export const provideAnnuaireImplementations = (): void => {
  provide(LIRE_LES_LIEUX, lireLesLieuxDepuisDesFichiers);
  provide(ECRIRE_ANNUAIRE, ecrireAnnuaireDansUnFichier);
};
