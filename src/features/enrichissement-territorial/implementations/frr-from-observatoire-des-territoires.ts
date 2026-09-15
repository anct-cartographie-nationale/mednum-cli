import type { FrrMap } from '../../../libraries/collectivites/index';
import { fetchFrrRows } from '../../../libraries/observatoire-des-territoires/index';
import type { LoadFrr } from '../keys/index';
import { type FrrTransfer, frrMapFromTransfer } from './frr.transfer';

export const frrFromObservatoireDesTerritoires: LoadFrr = async (): Promise<FrrMap> =>
  frrMapFromTransfer((await fetchFrrRows()) as FrrTransfer[]);
