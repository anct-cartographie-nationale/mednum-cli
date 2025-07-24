import * as fs from 'fs';
import {
  fromSchemaLieuxDeMediationNumerique,
  LieuMediationNumerique,
  SchemaLieuMediationNumerique
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import {
  Output,
  writeMediationNumeriqueCsvOutput,
  writeMediationNumeriqueDynamoDBJsonOutput,
  writeMediationNumeriqueJsonOutput,
  writePublierMetadataOutput,
  writeServicesDataInclusionJsonOutput,
  writeStructuresDataInclusionJsonOutput
} from '../../../../common';
import { DuplicationComparison, Groups, MergedLieuxByGroupMap, removeMerged } from '../../../steps';
import { formatToCSV } from '../../action/deduplication-comparisons-to-csv';
import { DedupliquerOptions } from '../../dedupliquer-options';

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
