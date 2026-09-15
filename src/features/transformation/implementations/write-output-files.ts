import {
  type LieuMediationNumerique,
  type SchemaLieuMediationNumerique,
  toSchemaLieuxDeMediationNumerique
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { Output } from '../../../libraries/file-system';
import { writeMediationNumeriqueCsvOutput, writeMediationNumeriqueJsonOutput } from '../../../libraries/mediation-numerique';
import type { WritePublicationMetadata } from '../keys';

export const writeOutputFiles =
  (producer: Output, writePublicationMetadata: WritePublicationMetadata) =>
  (lieuxDeMediationNumerique: LieuMediationNumerique[], suffix?: string): void => {
    const schemaLieuxDeMediationNumerique: SchemaLieuMediationNumerique[] =
      toSchemaLieuxDeMediationNumerique(lieuxDeMediationNumerique);

    writeMediationNumeriqueJsonOutput(producer, schemaLieuxDeMediationNumerique, suffix);
    writeMediationNumeriqueCsvOutput(producer, schemaLieuxDeMediationNumerique, suffix);
    writePublicationMetadata(producer, lieuxDeMediationNumerique, suffix);
  };
