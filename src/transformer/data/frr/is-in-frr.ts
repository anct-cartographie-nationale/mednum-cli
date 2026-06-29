import { IsInFrr, FrrMap } from '../../fields';

export const isInFrr =
  (frrMap: FrrMap): IsInFrr =>
  (codeInsee: string): boolean =>
    frrMap.get(codeInsee) ?? false;
