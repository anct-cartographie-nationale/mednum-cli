import type { Output } from '../../../libraries/file-system/index.js';
import type { AddressCache } from '../domain/index.js';
import { writeAddresesOutputFiles } from './address.write.js';

export const writeAddressesInFiles =
  (producer: Output) =>
  (addresseCache: AddressCache): void => {
    writeAddresesOutputFiles(producer)(addresseCache);
  };
