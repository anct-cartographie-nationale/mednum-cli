import { Feature } from '../data/localisation/localisation-from-geo';

export type AddressRecord = {
  dateDeTraitement: Date | string;
  addresseOriginale: string;
  responseBan?: Feature;
};

export type AddressRecorder = {
  commit: () => AddressReport;
  record: (addresse: Omit<AddressRecord, 'fixes'>) => AddressRecorder;
};

export type AddressReport = {
  entry: (index: number) => AddressRecorder;
  records: () => AddressRecord[];
};

const AddressRecorder = (index: number, records: AddressRecord[], addresses: AddressRecord[]): AddressRecorder => ({
  record: (address: Omit<AddressRecord, 'fixes'>): AddressRecorder => {
    addresses.push({ ...address });
    return AddressRecorder(index, records, addresses);
  },
  commit: (): AddressReport => {
    if (addresses.length > 0) records.push(...addresses);
    return AddressReport(records);
  }
});

export const AddressReport = (records: AddressRecord[] = []): AddressReport => ({
  entry: (index: number): AddressRecorder => AddressRecorder(index, records, []),
  records: (): AddressRecord[] => records
});
