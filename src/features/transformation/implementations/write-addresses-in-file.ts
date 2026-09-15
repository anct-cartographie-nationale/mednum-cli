import type { Output } from '../../../libraries/file-system';
import type { AddressCache } from '../domain';
import { writeAddresesOutputFiles } from './address.write';

export const writeAddressesInFiles =
  (producer: Output) =>
  (addresseCache: AddressCache): void => {
    writeAddresesOutputFiles(producer)(addresseCache);
  };
