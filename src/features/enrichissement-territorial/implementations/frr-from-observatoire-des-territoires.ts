import type { FrrMap } from '../../../libraries/collectivites';
import { fetchFrrRows } from '../../../libraries/observatoire-des-territoires';
import type { LoadFrr } from '../keys';
import { type FrrTransfer, frrMapFromTransfer } from './frr.transfer';

export const frrFromObservatoireDesTerritoires: LoadFrr = async (): Promise<FrrMap> =>
  frrMapFromTransfer((await fetchFrrRows()) as FrrTransfer[]);
