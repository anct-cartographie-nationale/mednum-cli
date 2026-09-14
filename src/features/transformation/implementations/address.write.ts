import * as fs from 'node:fs';
import { createFolderIfNotExist, noEmptyCell, type Output, throwWriteFileError } from '../../../libraries/file-system/index.js';
import { mediationNumeriqueFileName } from '../../../libraries/mediation-numerique/index.js';
import type { AddressRecord, AddressCache } from '../domain/index.js';
import type { Feature } from '../../../libraries/ban/index.js';

type AddressOutput = {
  dateDeTraitement: Date;
  addresseOriginale: string;
  responseBan?: Feature;
};

const writeCacheAddressesJsonOutput = (producer: Output, addresses: AddressOutput[]): void => {
  fs.writeFile(
    `${createFolderIfNotExist(producer.path)}/${mediationNumeriqueFileName(
      new Date(),
      producer.name,
      producer.territoire,
      'json',
      'addresses'
    )}`,
    JSON.stringify(addresses, noEmptyCell),
    throwWriteFileError
  );
};

export const writeAddresesOutputFiles =
  (producer: Output) =>
  (addressCache: AddressCache): void => {
    const addresses: AddressOutput[] = [];
    addressCache.records().forEach((addressEntry: AddressRecord): void => {
      const log: AddressOutput = {
        dateDeTraitement: new Date(),
        addresseOriginale: addressEntry?.addresseOriginale ?? '',
        ...(addressEntry.responseBan && { responseBan: addressEntry.responseBan })
      };
      addresses.push(log);
    });

    writeCacheAddressesJsonOutput(producer, addresses);
  };
