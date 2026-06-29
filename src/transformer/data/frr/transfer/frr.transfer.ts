import { FrrMap } from '../../../fields';

// Valeur sentinelle de l'indicateur codefrr pour une commune non classée en France Ruralités Revitalisation.
const NON_CLASSEE = '-9999';

export type FrrTransfer = {
  codgeo: string;
  codefrr: string;
};

export const frrMapFromTransfer = (transfer: FrrTransfer[]): FrrMap =>
  transfer.reduce(
    (frrMap: FrrMap, { codgeo, codefrr }: FrrTransfer): FrrMap => (codefrr === NON_CLASSEE ? frrMap : frrMap.set(codgeo, true)),
    new Map<string, boolean>()
  );
