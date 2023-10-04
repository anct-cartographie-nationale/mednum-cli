import { createHash } from 'crypto';
import { DataSource } from '../input';

export type DiffSinceLastTransformWithoutId = null;

export type DiffSinceLastTransformWithId = {
  toUpsert: DataSource[];
  toDelete: string[];
};

export type DiffSinceLastTransform = DiffSinceLastTransformWithId | DiffSinceLastTransformWithoutId;

export type Fingerprint = {
  id: string;
  hash: string;
};

const DIFF_WITHOUT_ID: DiffSinceLastTransformWithoutId = null;

const hashFor = (item: DataSource): string => createHash('sha256').update(JSON.stringify(item)).digest('hex');

const hasSameHash = (currentHash: string | undefined, item: DataSource): boolean => currentHash !== hashFor(item);

const toIdsToDeleteFrom =
  (newIds: string[]) =>
  (toDelete: string[], previousId: string): string[] =>
    newIds.includes(previousId) ? toDelete : [...toDelete, previousId];

const findDeletedIds = (previousIds: string[], newIds: string[]): string[] => previousIds.reduce(toIdsToDeleteFrom(newIds), []);

const getId = (idKey: string, item?: DataSource): string => (item?.[idKey] as string).toString();

const onlyMatchingItemIds =
  (idKey: string, currentItem: DataSource) =>
  (fingerprint: Fingerprint): boolean =>
    fingerprint.id === getId(idKey, currentItem);

const toItemToUpsert =
  (fingerprints: Fingerprint[], idKey: string) =>
  (toUpsert: DataSource[], item: DataSource): DataSource[] =>
    hasSameHash(fingerprints.find(onlyMatchingItemIds(idKey, item))?.hash, item) ? [...toUpsert, item] : toUpsert;

const idsToUpsert = (sourceItems: DataSource[], idKey: string, fingerprints: Fingerprint[]): DataSource[] =>
  sourceItems.reduce(toItemToUpsert(fingerprints, idKey), []);

const toFingerprintId = (fingerprint: Fingerprint): string => fingerprint.id;

const toItemId =
  (idKey: string) =>
  (currentItem: DataSource): string =>
    getId(idKey, currentItem);

const idsToDelete = (fingerprints: Fingerprint[], sourceItem: DataSource[], idKey: string): string[] =>
  findDeletedIds(fingerprints.map(toFingerprintId), sourceItem.map(toItemId(idKey)));

const findItemsToTransform = (sourceItem: DataSource[], fingerprints: Fingerprint[], idKey: string): DiffSinceLastTransform =>
  idKey === ''
    ? DIFF_WITHOUT_ID
    : {
        toUpsert: idsToUpsert(sourceItem, idKey, fingerprints),
        toDelete: idsToDelete(fingerprints, sourceItem, idKey)
      };

export const diffSinceLastTransform =
  (idKey: string, fingerprints: Fingerprint[]) =>
  (sourceItems: DataSource[]): DiffSinceLastTransform =>
    findItemsToTransform(sourceItems, fingerprints, idKey);

const toFingerprint =
  (idKey: string) =>
  (sourceItem: DataSource): Fingerprint => ({
    id: getId(idKey, sourceItem),
    hash: hashFor(sourceItem)
  });

export const fingerprintsFrom = (sourceItems: DataSource[], idKey: string): Fingerprint[] =>
  sourceItems.map(toFingerprint(idKey));

const matchingFingerprintById =
  (fingerprint: Fingerprint) =>
  (nextFingerprint: Fingerprint): boolean =>
    nextFingerprint.id === fingerprint.id;

const updateFingerprintHash = (fingerprint: Fingerprint, nextFingerprints: Fingerprint[]): Fingerprint => ({
  id: fingerprint.id,
  hash: nextFingerprints.find(matchingFingerprintById(fingerprint))?.hash ?? ''
});

const toUpdatedFingerprintHash =
  (matchingIds: string[], nextFingerprints: Fingerprint[]) =>
  (fingerprint: Fingerprint): Fingerprint =>
    matchingIds.includes(fingerprint.id) ? updateFingerprintHash(fingerprint, nextFingerprints) : fingerprint;

const onlyFingerprintsToAdd =
  (matchingIds: string[]) =>
  (fingerprint: Fingerprint): boolean =>
    !matchingIds.includes(fingerprint.id);

const onlyMatchingIds =
  (nextFingerprintsIds: string[]) =>
  (fingerprintId: string): boolean =>
    nextFingerprintsIds.includes(fingerprintId);

const onlyFingerprintsNotIn =
  (idsToRemove: string[]) =>
  (fingerprint: Fingerprint): boolean =>
    !idsToRemove.includes(fingerprint.id);

export const updateFingerprints = (
  fingerprints: Fingerprint[],
  nextFingerprints: Fingerprint[],
  toDelete: string[] = []
): Fingerprint[] => {
  const fingerprintsIds: string[] = fingerprints.map(toFingerprintId);
  const nextFingerprintsIds: string[] = nextFingerprints.map(toFingerprintId);
  const matchingIds: string[] = fingerprintsIds.filter(onlyMatchingIds(nextFingerprintsIds));

  return [
    ...fingerprints.filter(onlyFingerprintsNotIn(toDelete)).map(toUpdatedFingerprintHash(matchingIds, nextFingerprints)),
    ...nextFingerprints.filter(onlyFingerprintsToAdd(matchingIds))
  ];
};

export const canTransform = (diff: DiffSinceLastTransform): diff is DiffSinceLastTransformWithId => diff != null;
