import * as fs from 'fs';
import {
  createFolderIfNotExist,
  mediationNumeriqueFileName,
  noEmptyCell,
  Output,
  throwWriteFileError
} from '../../../../common';
import { AddressRecord, AddressCache } from '../../../storage';
import { Feature } from '../../../data/localisation/localisation-from-geo';

export type AddressOutput = {
  dateDeTraitement: Date;
  addresseOriginale: string;
  responseBan?: Feature;
};

const writeReportAddressesJsonOutput = (producer: Output, addresses: AddressOutput[]): void => {
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
  (addressReport: AddressCache): void => {
    const addresses: AddressOutput[] = [];
    addressReport.records().forEach((addressEntry: AddressRecord): void => {
      const log: AddressOutput = {
        dateDeTraitement: new Date(),
        addresseOriginale: addressEntry?.addresseOriginale ?? '',
        ...(addressEntry.responseBan && { responseBan: addressEntry.responseBan })
      };
      addresses.push(log);
    });

    writeReportAddressesJsonOutput(producer, addresses);
  };
