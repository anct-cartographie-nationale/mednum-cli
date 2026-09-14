import {
  type LieuMediationNumerique,
  type SchemaLieuMediationNumerique,
  toSchemaLieuxDeMediationNumerique
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { Output } from '../../../libraries/file-system/index.js';
import {
  writeMediationNumeriqueCsvOutput,
  writeMediationNumeriqueJsonOutput
} from '../../../libraries/mediation-numerique/index.js';
import type { WritePublicationMetadata } from '../keys/index.js';

export const writeOutputFiles =
  (producer: Output, writePublicationMetadata: WritePublicationMetadata) =>
  (lieuxDeMediationNumerique: LieuMediationNumerique[], suffix?: string): void => {
    const schemaLieuxDeMediationNumerique: SchemaLieuMediationNumerique[] =
      toSchemaLieuxDeMediationNumerique(lieuxDeMediationNumerique);

    writeMediationNumeriqueJsonOutput(producer, schemaLieuxDeMediationNumerique, suffix);
    writeMediationNumeriqueCsvOutput(producer, schemaLieuxDeMediationNumerique, suffix);
    writePublicationMetadata(producer, lieuxDeMediationNumerique, suffix);
  };
