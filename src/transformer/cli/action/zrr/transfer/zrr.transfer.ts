/* eslint-disable @typescript-eslint/naming-convention */

export type ZrrTransfer = {
  codgeo: string;
  zrr_simp: 'C - Classée en ZRR' | 'NC - Commune non classée';
};

export const zrrMapFromTransfer = (transfer: ZrrTransfer[]): Map<string, boolean> =>
  transfer.reduce(
    (zrrMap: Map<string, boolean>, transferItem: ZrrTransfer): Map<string, boolean> =>
      zrrMap.set(transferItem.codgeo, transferItem.zrr_simp === 'C - Classée en ZRR'),
    new Map<string, boolean>()
  );
