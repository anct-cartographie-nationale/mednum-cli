/* eslint-disable @typescript-eslint/naming-convention */

export type ZrrTransfer = {
  codgeo: string;
};

export const zrrMapFromTransfer = (transfer: ZrrTransfer[]): Map<string, boolean> =>
  transfer.reduce(
    (zrrMap: Map<string, boolean>, transferItem: ZrrTransfer): Map<string, boolean> => zrrMap.set(transferItem.codgeo, true),
    new Map<string, boolean>()
  );
