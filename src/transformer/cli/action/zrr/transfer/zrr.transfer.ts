/* eslint-disable @typescript-eslint/naming-convention */

export type ZrrTransfer = {
  com2018: string;
  commune_2018: string;
  population_2015: number;
  statut_zrr: 'Bénéficiaire' | 'Non classée';
  nom_dept: string;
  nom_region: string;
};

export const zrrMapFromTransfer = (transfer: ZrrTransfer[]): Map<string, boolean> =>
  transfer.reduce(
    (zrrMap: Map<string, boolean>, transferItem: ZrrTransfer): Map<string, boolean> =>
      zrrMap.set(transferItem.com2018, transferItem.statut_zrr === 'Bénéficiaire'),
    new Map<string, boolean>()
  );
