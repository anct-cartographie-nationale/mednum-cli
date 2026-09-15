import type { FrrMap, IsInFrr } from '../../../libraries/collectivites/index';

export const isInFrr =
  (frrMap: FrrMap): IsInFrr =>
  (codeInsee: string): boolean =>
    frrMap.get(codeInsee) ?? false;
