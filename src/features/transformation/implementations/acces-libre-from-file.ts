import { existsSync } from 'node:fs';
import { accesLibreErps } from '../../../libraries/acces-libre';
import { type AccesLibreIndex, accesLibreIndex } from '../domain';
import type { LoadAccesLibre } from '../keys';

const sansFiches = (raison: string, detail?: unknown): AccesLibreIndex => {
  console.error(`[Accès Libre] ${raison}, aucun lieu ne recevra de fiche`, detail ?? '');
  return accesLibreIndex([]);
};

export const accesLibreFromFile =
  (cheminLocal?: string): LoadAccesLibre =>
  async (): Promise<AccesLibreIndex> => {
    if (cheminLocal == null || !existsSync(cheminLocal)) return sansFiches(`export introuvable : ${cheminLocal ?? '(aucun)'}`);

    try {
      return accesLibreIndex(await accesLibreErps(cheminLocal));
    } catch (erreur: unknown) {
      return sansFiches('export illisible', erreur);
    }
  };
