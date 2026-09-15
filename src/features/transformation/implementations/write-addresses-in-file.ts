import type { Output } from '../../../libraries/file-system/index';
import type { AddressCache } from '../domain/index';
import { writeAddresesOutputFiles } from './address.write';

export const writeAddressesInFiles =
  (producer: Output) =>
  (addresseCache: AddressCache): void => {
    writeAddresesOutputFiles(producer)(addresseCache);
  };
