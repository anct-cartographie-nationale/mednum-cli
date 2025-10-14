import * as fs from 'fs';
import {
  createFolderIfNotExist,
  mediationNumeriqueFileName,
  noEmptyCell,
  Output,
  throwWriteFileError
} from '../../../../common';
import { AddresseRecord, AddresseReport } from '../../../history';
import { Feature } from '../../../data/localisation/localisation-from-geo';

export type AddresseOutput = {
  dateDeTraitement: Date;
  addresseOriginale: string;
  responseBan?: Feature;
};

const writeReportAddressesJsonOutput = (producer: Output, addresses: AddresseOutput[]): void => {
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
  (addresseReport: AddresseReport): void => {
    const addresses: AddresseOutput[] = [];
    addresseReport.records().forEach((addresseEntry: AddresseRecord): void => {
      const log: AddresseOutput = {
        dateDeTraitement: new Date(),
        addresseOriginale: addresseEntry?.addresseOriginale ?? '',
        responseBan: addresseEntry?.responseBan
      };
      addresses.push(log);
    });

    writeReportAddressesJsonOutput(producer, addresses);
  };
