import axios, { AxiosResponse } from 'axios';
/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import * as fs from 'fs';
import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DedupliquerOptions } from '../dedupliquer-options';
import { removeDuplicates } from './remove-duplicates';
import { formatToCSV } from './deduplication-comparisons-to-csv';
import { duplicationComparisons } from './duplication-comparisons';

export const dedupliquerAction = async (dedupliquerOptions: DedupliquerOptions): Promise<void> => {
  const lieuxFromDataInclusion: AxiosResponse<SchemaLieuMediationNumerique[]> = await axios.get(dedupliquerOptions.source);
  const lieuxWithLessDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(lieuxFromDataInclusion.data);

  console.log(lieuxFromDataInclusion.data.length);
  console.log(lieuxWithLessDuplicates.length);

  // todo: write lieux withLess duplicates in file, then add transform configuration and publish

  fs.writeFileSync(`./assets/input/data-inclusion/data-inclusion.json`, JSON.stringify(lieuxWithLessDuplicates), 'utf8');

  fs.writeFileSync(
    `./assets/output/data-inclusion/duplications.csv`,
    formatToCSV(duplicationComparisons(lieuxFromDataInclusion.data)),
    'utf8'
  );
};
