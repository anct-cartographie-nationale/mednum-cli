import { codeCommuneDe, type FrrMap, type IsInFrr } from '../../../libraries/collectivites';

export const isInFrr =
  (frrMap: FrrMap): IsInFrr =>
  (codeInsee: string): boolean =>
    frrMap.get(codeCommuneDe(codeInsee)) ?? false;
