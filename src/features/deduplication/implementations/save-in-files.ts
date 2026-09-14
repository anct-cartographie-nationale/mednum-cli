import * as fs from 'node:fs';
import {
  fromSchemaLieuxDeMediationNumerique,
  type LieuMediationNumerique,
  type SchemaLieuMediationNumerique
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { Output } from '../../../libraries/file-system';
import {
  writeMediationNumeriqueCsvOutput,
  writeMediationNumeriqueDynamoDBJsonOutput,
  writeMediationNumeriqueJsonOutput
} from '../../../libraries/mediation-numerique';
import {
  type DuplicationComparison,
  formatToCSV,
  type Groups,
  type MergedLieuxByGroupMap,
  removeMerged,
  type SaveDeduplication,
  type WritePublicationMetadata
} from '../domain';

const writeOutputFiles =
  (writePublicationMetadata: WritePublicationMetadata) =>
  (
    producer: Output,
    lieuxWithLessDuplicates: SchemaLieuMediationNumerique[],
    lieuxDeMediationNumerique: LieuMediationNumerique[]
  ): void => {
    writeMediationNumeriqueJsonOutput(producer, lieuxWithLessDuplicates, 'sans-doublons');
    writeMediationNumeriqueDynamoDBJsonOutput(producer, lieuxWithLessDuplicates);
    writeMediationNumeriqueCsvOutput(producer, lieuxWithLessDuplicates, 'sans-doublons');
    writePublicationMetadata(producer, lieuxDeMediationNumerique, 'sans-doublons');
  };

export const saveInFiles =
  (producer: Output, writePublicationMetadata: WritePublicationMetadata): SaveDeduplication =>
  async (
    groups: Groups,
    merged: MergedLieuxByGroupMap,
    lieuxToDeduplicate: SchemaLieuMediationNumerique[] = [],
    duplications: DuplicationComparison[] = []
  ): Promise<void> => {
    const lieuxWithLessDuplicates: SchemaLieuMediationNumerique[] = [
      ...removeMerged(lieuxToDeduplicate, groups),
      ...Array.from(merged.values())
    ];

    writeOutputFiles(writePublicationMetadata)(
      producer,
      lieuxWithLessDuplicates,
      fromSchemaLieuxDeMediationNumerique(lieuxWithLessDuplicates)
    );

    fs.writeFileSync(`${producer.path}/duplications.csv`, formatToCSV(duplications), 'utf8');
  };
