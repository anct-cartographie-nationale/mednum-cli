import * as fs from 'node:fs';
import type { DataInclusionMerged } from '../domain';
import type { WriteExtraction } from '../keys';

export const writeExtractionInFile: WriteExtraction = (outputFile: string, records: DataInclusionMerged[]): void => {
  fs.writeFileSync(outputFile, JSON.stringify(records), 'utf8');
};
