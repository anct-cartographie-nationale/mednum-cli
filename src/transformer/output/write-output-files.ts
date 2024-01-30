import {
  LieuMediationNumerique,
  SchemaLieuMediationNumerique,
  toSchemaLieuxDeMediationNumerique
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import {
  Output,
  writeMediationNumeriqueCsvOutput,
  writeMediationNumeriqueJsonOutput,
  writePublierMetadataOutput,
  writeServicesDataInclusionJsonOutput,
  writeStructuresDataInclusionJsonOutput
} from '../../common';

export const writeOutputFiles =
  (producer: Output) =>
  (lieuxDeMediationNumerique: LieuMediationNumerique[], suffix?: string): void => {
    const schemaLieuxDeMediationNumerique: SchemaLieuMediationNumerique[] =
      toSchemaLieuxDeMediationNumerique(lieuxDeMediationNumerique);

    writeMediationNumeriqueJsonOutput(producer, schemaLieuxDeMediationNumerique, suffix);
    writeMediationNumeriqueCsvOutput(producer, schemaLieuxDeMediationNumerique, suffix);
    writeStructuresDataInclusionJsonOutput(producer, lieuxDeMediationNumerique, suffix);
    writeServicesDataInclusionJsonOutput(producer, lieuxDeMediationNumerique, suffix);
    writePublierMetadataOutput(producer, lieuxDeMediationNumerique);
  };
