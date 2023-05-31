import axios, { AxiosResponse } from 'axios';
/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import * as fs from 'fs';
import {
  fromSchemaLieuxDeMediationNumerique,
  LieuMediationNumerique,
  SchemaLieuMediationNumerique
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import {
  Output,
  writeMediationNumeriqueCsvOutput,
  writeMediationNumeriqueJsonOutput,
  writePublierMetadataOutput,
  writeServicesDataInclusionJsonOutput,
  writeStructuresDataInclusionJsonOutput
} from '../../../common';
import { DedupliquerOptions } from '../dedupliquer-options';
import { removeDuplicates } from './remove-duplicates';
import { formatToCSV } from './deduplication-comparisons-to-csv';
import { duplicationComparisons } from './duplication-comparisons';

const writeOutputFiles = (
  producer: Output,
  lieuxWithLessDuplicates: SchemaLieuMediationNumerique[],
  lieuxDeMediationNumerique: LieuMediationNumerique[]
): void => {
  writeMediationNumeriqueJsonOutput(producer, lieuxWithLessDuplicates, 'sans-doublons');
  writeMediationNumeriqueCsvOutput(producer, lieuxWithLessDuplicates, 'sans-doublons');
  writeStructuresDataInclusionJsonOutput(producer, lieuxDeMediationNumerique, 'sans-doublons');
  writeServicesDataInclusionJsonOutput(producer, lieuxDeMediationNumerique, 'sans-doublons');
  writePublierMetadataOutput(producer, lieuxDeMediationNumerique, 'sans-doublons');
};

export const dedupliquerAction = async (dedupliquerOptions: DedupliquerOptions): Promise<void> => {
  const lieuxFromDataInclusion: AxiosResponse<SchemaLieuMediationNumerique[]> = await axios.get(dedupliquerOptions.source);
  const lieuxWithLessDuplicates: SchemaLieuMediationNumerique[] = removeDuplicates(new Date())(lieuxFromDataInclusion.data);
  const lieuxDeMediationNumerique: LieuMediationNumerique[] = fromSchemaLieuxDeMediationNumerique(lieuxWithLessDuplicates);

  writeOutputFiles(
    { name: 'Data Inclusion', path: './assets/output/data-inclusion', territoire: 'National' },
    lieuxWithLessDuplicates,
    lieuxDeMediationNumerique
  );

  fs.writeFileSync(
    `./assets/output/data-inclusion/duplications.csv`,
    formatToCSV(duplicationComparisons(lieuxFromDataInclusion.data)),
    'utf8'
  );
};
