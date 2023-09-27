/* eslint-disable @typescript-eslint/naming-convention */

import { ZrrMap } from '../../../fields';

export type ZrrTransfer = {
  codgeo: string;
};

export const zrrMapFromTransfer = (transfer: ZrrTransfer[]): ZrrMap =>
  transfer.reduce(
    (zrrMap: ZrrMap, transferItem: ZrrTransfer): ZrrMap => zrrMap.set(transferItem.codgeo, true),
    new Map<string, boolean>()
  );
