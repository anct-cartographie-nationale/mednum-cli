import { createHash } from 'node:crypto';
import { DataSource } from '../input';

export type DiffSinceLastTransformWithoutId = null;

export type DiffSinceLastTransformWithId = {
  toUpsert: DataSource[];
  toDelete: FingerprintToDelete[];
};

export type DiffSinceLastTransform = DiffSinceLastTransformWithId | DiffSinceLastTransformWithoutId;

export type Fingerprint = {
  sourceId: string;
  hash?: string;
};

export type FingerprintToDelete = {
  sourceId: string;
};

const DIFF_WITHOUT_ID: DiffSinceLastTransformWithoutId = null;

const hashFor = (item: DataSource): string => createHash('sha256').update(JSON.stringify(item)).digest('hex');

const hasSameHash = (currentHash: string | undefined, item: DataSource): boolean => currentHash === hashFor(item);

const toInnerProperty = (source: DataSource | string, key: string): DataSource | string =>
  typeof source === 'string' ? source : (source[key] as DataSource | string);

const getId = (idKey: string, item: DataSource): string => idKey.split('.').reduce(toInnerProperty, item).toString();

const onlyMatchingItemIds =
  (idKey: string, item: DataSource) =>
  (fingerprint: Fingerprint): boolean =>
    fingerprint.sourceId === getId(idKey, item);

const toItemToUpsert =
  (fingerprints: Fingerprint[], idKey: string) =>
  (toUpsert: DataSource[], item: DataSource): DataSource[] =>
    hasSameHash(fingerprints.find(onlyMatchingItemIds(idKey, item))?.hash, item) ? toUpsert : [...toUpsert, item];

const toFingerprintId = (fingerprint: Fingerprint): string => fingerprint.sourceId;

const toItemId =
  (idKey: string) =>
  (currentItem: DataSource): string =>
    getId(idKey, currentItem);

const toIdsToDeleteFrom =
  (sourceItemIds: string[]) =>
  (fingerprintsToDelete: FingerprintToDelete[], fingerprint: Fingerprint): FingerprintToDelete[] =>
    sourceItemIds.includes(fingerprint.sourceId)
      ? fingerprintsToDelete
      : [...fingerprintsToDelete, { sourceId: fingerprint.sourceId }];

const onlyWithHash = (fingerprint: Fingerprint): boolean => fingerprint.hash != null;

const findItemsToTransform = (sourceItems: DataSource[], fingerprints: Fingerprint[], idKey: string): DiffSinceLastTransform =>
  idKey === ''
    ? DIFF_WITHOUT_ID
    : {
        toUpsert: sourceItems.reduce(toItemToUpsert(fingerprints, idKey), []),
        toDelete: fingerprints.filter(onlyWithHash).reduce(toIdsToDeleteFrom(sourceItems.map(toItemId(idKey))), [])
      };

export const diffSinceLastTransform =
  (idKey: string, fingerprints: Fingerprint[]) =>
  (sourceItems: DataSource[]): DiffSinceLastTransform =>
    findItemsToTransform(sourceItems, fingerprints, idKey);

const toFingerprint =
  (idKey: string) =>
  (sourceItem: DataSource): Fingerprint => ({
    sourceId: getId(idKey, sourceItem),
    hash: hashFor(sourceItem)
  });

const onlyValidSourceId = (fingerprint: Fingerprint): boolean => fingerprint.sourceId !== '';

export const fingerprintsFrom = (sourceItems: DataSource[], idKey: string): Fingerprint[] =>
  sourceItems.map(toFingerprint(idKey)).filter(onlyValidSourceId);

const matchingFingerprintById =
  (fingerprint: Fingerprint) =>
  (nextFingerprint: Fingerprint): boolean =>
    nextFingerprint.sourceId === fingerprint.sourceId;

const updateFingerprintHash = (fingerprint: Fingerprint, nextFingerprints: Fingerprint[]): Fingerprint => ({
  sourceId: fingerprint.sourceId,
  hash: nextFingerprints.find(matchingFingerprintById(fingerprint))?.hash ?? ''
});

const toUpdatedFingerprintHash =
  (matchingIds: string[], nextFingerprints: Fingerprint[]) =>
  (fingerprint: Fingerprint): Fingerprint =>
    matchingIds.includes(fingerprint.sourceId) ? updateFingerprintHash(fingerprint, nextFingerprints) : fingerprint;

const onlyFingerprintsToAdd =
  (matchingIds: string[]) =>
  (fingerprint: Fingerprint): boolean =>
    !matchingIds.includes(fingerprint.sourceId) && fingerprint.sourceId !== '';

const onlyMatchingIds =
  (nextFingerprintsIds: string[]) =>
  (fingerprintId: string): boolean =>
    nextFingerprintsIds.includes(fingerprintId);

const onlyFingerprintsNotIn =
  (idsToRemove: string[]) =>
  (fingerprint: Fingerprint): boolean =>
    !idsToRemove.includes(fingerprint.sourceId);

export const updateFingerprints = (
  fingerprints: Fingerprint[],
  nextFingerprints: Fingerprint[],
  fingerprintToDelete: FingerprintToDelete[] = []
): Fingerprint[] => {
  const fingerprintsIds: string[] = fingerprints.map(toFingerprintId);
  const nextFingerprintsIds: string[] = nextFingerprints.map(toFingerprintId);
  const matchingIds: string[] = fingerprintsIds.filter(onlyMatchingIds(nextFingerprintsIds));
  const toDelete: string[] = fingerprintToDelete.map((fingerprint: FingerprintToDelete): string => fingerprint.sourceId);

  return [
    ...fingerprints.filter(onlyFingerprintsNotIn(toDelete)).map(toUpdatedFingerprintHash(matchingIds, nextFingerprints)),
    ...nextFingerprints.filter(onlyFingerprintsToAdd(matchingIds))
  ];
};

export const canTransform = (diff: DiffSinceLastTransform): diff is DiffSinceLastTransformWithId => diff != null;
