import { Feature } from '../data/localisation/localisation-from-geo';

export type AddresseRecord = {
  dateDeTraitement: Date | string;
  addresseOriginale: string;
  responseBan?: Feature;
};

export type AddresseRecorder = {
  commit: () => AddresseReport;
  record: (addresse: Omit<AddresseRecord, 'fixes'>) => AddresseRecorder;
};

export type AddresseReport = {
  entry: (index: number) => AddresseRecorder;
  records: () => AddresseRecord[];
};

const AddresseRecorder = (index: number, records: AddresseRecord[], addresses: AddresseRecord[]): AddresseRecorder => ({
  record: (addresse: Omit<AddresseRecord, 'fixes'>): AddresseRecorder => {
    addresses.push({ ...addresse });
    return AddresseRecorder(index, records, addresses);
  },
  commit: (): AddresseReport => {
    if (addresses.length > 0) records.push(...addresses);
    return AddresseReport(records);
  }
});

export const AddresseReport = (records: AddresseRecord[] = []): AddresseReport => ({
  entry: (index: number): AddresseRecorder => AddresseRecorder(index, records, []),
  records: (): AddresseRecord[] => records
});
