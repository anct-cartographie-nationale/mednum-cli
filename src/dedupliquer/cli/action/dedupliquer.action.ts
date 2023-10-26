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
  writeMediationNumeriqueDynamoDBJsonOutput,
  writePublierMetadataOutput,
  writeServicesDataInclusionJsonOutput,
  writeStructuresDataInclusionJsonOutput
} from '../../../common';
import { DedupliquerOptions } from '../dedupliquer-options';
import { groupDuplicates, Groups } from './group-duplicates/group-duplicates';
import { mergeDuplicates } from './merge-duplicates';
import { formatToCSV } from './deduplication-comparisons-to-csv';
import { DuplicationComparison, duplicationComparisons } from './duplication-comparisons';
import { removeMerged } from './remove-merged/remove-merged';

const DUPLICATION_SCORE_THRESHOLD: 60 = 60 as const;

const writeOutputFiles = (
  producer: Output,
  lieuxWithLessDuplicates: SchemaLieuMediationNumerique[],
  lieuxDeMediationNumerique: LieuMediationNumerique[]
): void => {
  writeMediationNumeriqueJsonOutput(producer, lieuxWithLessDuplicates, 'sans-doublons');
  writeMediationNumeriqueDynamoDBJsonOutput(producer, lieuxWithLessDuplicates);
  writeMediationNumeriqueCsvOutput(producer, lieuxWithLessDuplicates, 'sans-doublons');
  writeStructuresDataInclusionJsonOutput(producer, lieuxDeMediationNumerique, 'sans-doublons');
  writeServicesDataInclusionJsonOutput(producer, lieuxDeMediationNumerique, 'sans-doublons');
  writePublierMetadataOutput(producer, lieuxDeMediationNumerique, 'sans-doublons');
};

const onlyMoreThanDuplicationScoreThreshold = (duplicationComparison: DuplicationComparison): boolean =>
  duplicationComparison.score > DUPLICATION_SCORE_THRESHOLD;

const writeOutputInFiles = (
  lieux: SchemaLieuMediationNumerique[],
  groups: Groups,
  dedupliquerOptions: DedupliquerOptions
): void => {
  const lieuxWithLessDuplicates: SchemaLieuMediationNumerique[] = [
    ...removeMerged(lieux, groups),
    ...mergeDuplicates(new Date())(lieux, groups)
  ];

  writeOutputFiles(
    { name: dedupliquerOptions.sourceName, path: dedupliquerOptions.outputDirectory, territoire: dedupliquerOptions.territory },
    lieuxWithLessDuplicates,
    fromSchemaLieuxDeMediationNumerique(lieuxWithLessDuplicates)
  );

  fs.writeFileSync(
    `${dedupliquerOptions.outputDirectory}/duplications.csv`,
    formatToCSV(duplicationComparisons(lieux)),
    'utf8'
  );
};

export const dedupliquerAction = async (dedupliquerOptions: DedupliquerOptions): Promise<void> => {
  const lieuxToDeduplicate: AxiosResponse<SchemaLieuMediationNumerique[]> = await axios.get(dedupliquerOptions.source);

  // todo: need to have preexisting groups as input
  // todo: need to use preexisting groups to initialize groups

  const duplicationComparisonsToGroup: DuplicationComparison[] = duplicationComparisons(lieuxToDeduplicate.data).filter(
    onlyMoreThanDuplicationScoreThreshold
  );

  const groups: Groups = groupDuplicates(duplicationComparisonsToGroup);

  writeOutputInFiles(lieuxToDeduplicate.data, groups, dedupliquerOptions);

  // todo: Apply Merge for file OR upload to API (need to upload only groups that are not preexisting or updated)
};
