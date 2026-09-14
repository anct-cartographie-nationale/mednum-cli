import {
  type LieuMediationNumerique,
  type SchemaLieuMediationNumerique,
  toSchemaLieuxDeMediationNumerique
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { writePublicationMetadataInFile } from '../../features/publication';
import type { Output } from '../../libraries/file-system';
import { writeMediationNumeriqueCsvOutput, writeMediationNumeriqueJsonOutput } from '../../libraries/mediation-numerique';

export const writeOutputFiles =
  (producer: Output) =>
  (lieuxDeMediationNumerique: LieuMediationNumerique[], suffix?: string): void => {
    const schemaLieuxDeMediationNumerique: SchemaLieuMediationNumerique[] =
      toSchemaLieuxDeMediationNumerique(lieuxDeMediationNumerique);

    writeMediationNumeriqueJsonOutput(producer, schemaLieuxDeMediationNumerique, suffix);
    writeMediationNumeriqueCsvOutput(producer, schemaLieuxDeMediationNumerique, suffix);
    writePublicationMetadataInFile(producer, lieuxDeMediationNumerique, suffix);
  };
