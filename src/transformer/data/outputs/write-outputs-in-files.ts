import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { keepOneEntryPerSource } from '../../cli/action/duplicates-same-source/duplicates-same-source';
import { TransformerOptions } from '../../cli/transformer-options';
import { writeOutputFiles } from '../../output';

export const writeOutputsInFiles =
  (transformerOptions: TransformerOptions) =>
  (lieuxDeMediationNumeriqueFiltered: Record<string, LieuMediationNumerique>): void => {
    writeOutputFiles({
      path: transformerOptions.outputDirectory,
      name: transformerOptions.sourceName,
      territoire: transformerOptions.territory
    })(keepOneEntryPerSource(Object.values(lieuxDeMediationNumeriqueFiltered)));
  };
