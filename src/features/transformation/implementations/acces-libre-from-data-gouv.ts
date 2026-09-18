import { accesLibreErps } from '../../../libraries/acces-libre';
import { type AccesLibreIndex, accesLibreIndex } from '../domain';
import type { LoadAccesLibre } from '../keys';

const sansFiches = (erreur: unknown): AccesLibreIndex => {
  console.error("[Accès Libre] Fiches d'accessibilité indisponibles, aucun lieu n'en recevra", erreur);
  return accesLibreIndex([]);
};

export const accesLibreFromDataGouv =
  (cheminLocal?: string): LoadAccesLibre =>
  async (): Promise<AccesLibreIndex> => {
    try {
      return accesLibreIndex(await accesLibreErps(cheminLocal));
    } catch (erreur: unknown) {
      return sansFiches(erreur);
    }
  };
