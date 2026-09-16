import type { Feature } from '../../../../libraries/ban';

export type AddressRecord = {
  dateDeTraitement: Date | string;
  addresseOriginale: string;
  responseBan?: Feature;
};

type AddressRecorder = {
  commit: () => AddressCache;
  record: (addresse: AddressRecord) => AddressRecorder;
};

export type AddressCache = {
  entry: (index: number) => AddressRecorder;
  records: () => AddressRecord[];
};

/**
 * Une adresse n'a qu'une entrée : la table est indexée par l'étiquette, si bien qu'un doublon
 * ne peut pas se former, ni pendant une exécution ni entre deux lieux qui partagent l'adresse.
 *
 * Quand la même étiquette revient, le géocodage l'emporte sur son absence. Sans cette règle,
 * une tentative infructueuse survenue après une réussie effacerait ce que l'on savait, et le
 * sort du lieu dépendrait de l'ordre de traitement.
 */
const keepGeocoded = (known: AddressRecord | undefined, candidate: AddressRecord): AddressRecord =>
  known?.responseBan != null && candidate.responseBan == null ? known : candidate;

const AddressRecorder = (records: Map<string, AddressRecord>, addresses: readonly AddressRecord[] = []): AddressRecorder => ({
  record: (address: AddressRecord): AddressRecorder => AddressRecorder(records, [...addresses, { ...address }]),
  commit: (): AddressCache => {
    addresses.forEach((address: AddressRecord): void => {
      records.set(address.addresseOriginale, keepGeocoded(records.get(address.addresseOriginale), address));
    });
    return AddressCache(records);
  }
});

const asMap = (records: AddressRecord[] | Map<string, AddressRecord>): Map<string, AddressRecord> =>
  records instanceof Map
    ? records
    : records.reduce(
        (known: Map<string, AddressRecord>, record: AddressRecord): Map<string, AddressRecord> =>
          known.set(record.addresseOriginale, keepGeocoded(known.get(record.addresseOriginale), record)),
        new Map<string, AddressRecord>()
      );

export const AddressCache = (records: AddressRecord[] | Map<string, AddressRecord> = []): AddressCache => {
  const known: Map<string, AddressRecord> = asMap(records);

  return {
    entry: (_: number): AddressRecorder => AddressRecorder(known),
    records: (): AddressRecord[] => [...known.values()]
  };
};
