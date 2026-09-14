import type { FrrMap, IsInFrr } from '../../../libraries/collectivites/index.js';

export const isInFrr =
  (frrMap: FrrMap): IsInFrr =>
  (codeInsee: string): boolean =>
    frrMap.get(codeInsee) ?? false;
