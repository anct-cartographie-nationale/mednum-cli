import * as fs from 'node:fs';
import type { DataInclusionMerged } from '../domain/index.js';
import type { WriteExtraction } from '../keys/index.js';

export const writeExtractionInFile: WriteExtraction = (outputFile: string, records: DataInclusionMerged[]): void => {
  fs.writeFileSync(outputFile, JSON.stringify(records), 'utf8');
};
