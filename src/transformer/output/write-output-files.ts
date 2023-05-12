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
  (lieuxDeMediationNumerique: LieuMediationNumerique[]): void => {
    const schemaLieuxDeMediationNumerique: SchemaLieuMediationNumerique[] =
      toSchemaLieuxDeMediationNumerique(lieuxDeMediationNumerique);

    writeMediationNumeriqueJsonOutput(producer, schemaLieuxDeMediationNumerique);
    writeMediationNumeriqueCsvOutput(producer, schemaLieuxDeMediationNumerique);
    writeStructuresDataInclusionJsonOutput(producer, lieuxDeMediationNumerique);
    writeServicesDataInclusionJsonOutput(producer, lieuxDeMediationNumerique);
    writePublierMetadataOutput(producer, lieuxDeMediationNumerique);
  };
