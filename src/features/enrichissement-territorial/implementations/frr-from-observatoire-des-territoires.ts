import type { FrrMap } from '../../../libraries/collectivites/index.js';
import { fetchFrrRows } from '../../../libraries/observatoire-des-territoires/index.js';
import type { LoadFrr } from '../keys/index.js';
import { type FrrTransfer, frrMapFromTransfer } from './frr.transfer.js';

export const frrFromObservatoireDesTerritoires: LoadFrr = async (): Promise<FrrMap> =>
  frrMapFromTransfer((await fetchFrrRows()) as FrrTransfer[]);
