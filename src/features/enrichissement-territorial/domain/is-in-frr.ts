import type { FrrMap, IsInFrr } from '../../../libraries/collectivites';

export const isInFrr =
  (frrMap: FrrMap): IsInFrr =>
  (codeInsee: string): boolean =>
    frrMap.get(codeInsee) ?? false;
