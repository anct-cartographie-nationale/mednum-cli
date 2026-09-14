import * as fs from 'node:fs';
import {
  fromSchemaLieuxDeMediationNumerique,
  type LieuMediationNumerique,
  type SchemaLieuMediationNumerique
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { writePublierMetadataOutput } from '../../../../common';
import type { Output } from '../../../../libraries/file-system';
import {
  writeMediationNumeriqueCsvOutput,
  writeMediationNumeriqueDynamoDBJsonOutput,
  writeMediationNumeriqueJsonOutput
} from '../../../../libraries/mediation-numerique';
import { type DuplicationComparison, type Groups, type MergedLieuxByGroupMap, removeMerged } from '../../../steps';
import { formatToCSV } from '../../action/deduplication-comparisons-to-csv';
import type { DedupliquerOptions } from '../../dedupliquer-options';

const writeOutputFiles = (
  producer: Output,
  lieuxWithLessDuplicates: SchemaLieuMediationNumerique[],
  lieuxDeMediationNumerique: LieuMediationNumerique[]
): void => {
  writeMediationNumeriqueJsonOutput(producer, lieuxWithLessDuplicates, 'sans-doublons');
  writeMediationNumeriqueDynamoDBJsonOutput(producer, lieuxWithLessDuplicates);
  writeMediationNumeriqueCsvOutput(producer, lieuxWithLessDuplicates, 'sans-doublons');
  writePublierMetadataOutput(producer, lieuxDeMediationNumerique, 'sans-doublons');
};

export const saveInFiles =
  (dedupliquerOptions: DedupliquerOptions) =>
  (
    groups: Groups,
    merged: MergedLieuxByGroupMap,
    lieuxToDeduplicate: SchemaLieuMediationNumerique[],
    duplications: DuplicationComparison[]
  ): void => {
    const lieuxWithLessDuplicates: SchemaLieuMediationNumerique[] = [
      ...removeMerged(lieuxToDeduplicate, groups),
      ...Array.from(merged.values())
    ];

    writeOutputFiles(
      {
        name: dedupliquerOptions.sourceName,
        path: dedupliquerOptions.outputDirectory,
        territoire: dedupliquerOptions.territory
      },
      lieuxWithLessDuplicates,
      fromSchemaLieuxDeMediationNumerique(lieuxWithLessDuplicates)
    );

    fs.writeFileSync(`${dedupliquerOptions.outputDirectory}/duplications.csv`, formatToCSV(duplications), 'utf8');
  };
