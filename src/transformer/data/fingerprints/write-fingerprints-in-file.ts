/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import * as fs from 'fs';
import {
  canTransform,
  DiffSinceLastTransform,
  Fingerprint,
  fingerprintsFrom,
  updateFingerprints
} from '../../cli/diff-since-last-transform';
import { TransformerOptions } from '../../cli/transformer-options';

export const writeFingerprints =
  (idKey: string, fingerprints: Fingerprint[], transformerOptions: TransformerOptions) =>
  (itemsToTransform: DiffSinceLastTransform): void => {
    if (!canTransform(itemsToTransform)) return;

    const updatedFingerprints: Fingerprint[] = updateFingerprints(
      fingerprints,
      fingerprintsFrom(itemsToTransform.toUpsert, idKey),
      itemsToTransform.toDelete
    );

    const filePath: string = transformerOptions.configFile.replace('.config.json', '.fingerprint.json');
    fs.writeFileSync(filePath, JSON.stringify(updatedFingerprints));
  };
