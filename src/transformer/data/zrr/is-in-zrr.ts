import { IsInZrr, ZrrMap } from '../../fields';

export const isInZrr =
  (zrrMap: ZrrMap): IsInZrr =>
  (codeInsee: string): boolean =>
    zrrMap.get(codeInsee) ?? false;
