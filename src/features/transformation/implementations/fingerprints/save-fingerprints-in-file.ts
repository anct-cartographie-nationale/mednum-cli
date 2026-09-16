import * as fs from 'node:fs';
import {
  canTransform,
  type DiffSinceLastTransform,
  type Fingerprint,
  fingerprintsFrom,
  updateFingerprints
} from '../../domain';

export const saveFingerprintsInFile =
  (idKey: string, fingerprints: Fingerprint[], fingerprintFile: string) =>
  (itemsToTransform: DiffSinceLastTransform): void => {
    if (!canTransform(itemsToTransform)) return;

    const updatedFingerprints: Fingerprint[] = updateFingerprints(
      fingerprints,
      fingerprintsFrom(itemsToTransform.toUpsert, idKey),
      itemsToTransform.toDelete
    );

    fs.writeFileSync(fingerprintFile, JSON.stringify(updatedFingerprints));
  };
