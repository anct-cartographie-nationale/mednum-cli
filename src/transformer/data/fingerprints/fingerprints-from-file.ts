import * as fs from 'fs';
import { Fingerprint } from '../../cli/diff-since-last-transform';
import { TransformerOptions } from '../../cli/transformer-options';

export const fingerprintsFromFile = async (transformerOptions: TransformerOptions): Promise<Fingerprint[]> => {
  const filePath: string = transformerOptions.configFile.replace('.config.json', '.fingerprint.json');

  try {
    return JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
  } catch {
    return [];
  }
};
