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
 * Une adresse que la Base Adresse Nationale n'a pas su résoudre n'est pas redemandée à chaque
 * exécution : la publication est quotidienne, et une adresse mal saisie le reste. La tentative
 * infructueuse vaut donc connaissance pendant une semaine, puis l'adresse redevient à tenter —
 * le référentiel s'enrichit, et une panne passagère ne doit pas condamner l'adresse.
 */
export const RETRY_UNRESOLVED_AFTER_DAYS = 7;

const DAY_IN_MS = 86_400_000;

const attemptedAt = (dateDeTraitement: Date | string): number => new Date(dateDeTraitement).getTime();

/**
 * Une date absente ou illisible vaut tentative ancienne : mieux vaut redemander une adresse de
 * trop que d'en condamner une sur une date qu'on ne sait pas lire.
 */
export const isRecentFailedAttempt = (record?: AddressRecord): boolean => {
  if (record == null || record.responseBan != null) return false;

  const attempted: number = attemptedAt(record.dateDeTraitement);

  return !Number.isNaN(attempted) && Date.now() - attempted < RETRY_UNRESOLVED_AFTER_DAYS * DAY_IN_MS;
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
