import { Feature } from '../data/localisation/localisation-from-geo';

export type AddressRecord = {
  dateDeTraitement: Date | string;
  addresseOriginale: string;
  responseBan?: Feature;
};

export type AddressRecorder = {
  commit: () => AddressCache;
  record: (addresse: AddressRecord) => AddressRecorder;
};

export type AddressCache = {
  entry: (index: number) => AddressRecorder;
  records: () => AddressRecord[];
};

const AddressRecorder = (index: number, records: AddressRecord[], addresses: AddressRecord[]): AddressRecorder => ({
  record: (address: AddressRecord): AddressRecorder => {
    addresses.push({ ...address });
    return AddressRecorder(index, records, addresses);
  },
  commit: (): AddressCache => {
    if (addresses.length > 0) records.push(...addresses);
    return AddressCache(records);
  }
});

export const AddressCache = (records: AddressRecord[] = []): AddressCache => ({
  entry: (index: number): AddressRecorder => AddressRecorder(index, records, []),
  records: (): AddressRecord[] => records
});
