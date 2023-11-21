import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { TransformerOptions } from '../../cli/transformer-options';
import { writeOutputFiles } from '../../output';

export const saveOutputsInFiles =
  (transformerOptions: TransformerOptions) =>
  async (lieuxMediationNumerique: LieuMediationNumerique[]): Promise<void> =>
    Promise.resolve().then((): void => {
      writeOutputFiles({
        path: transformerOptions.outputDirectory,
        name: transformerOptions.sourceName,
        territoire: transformerOptions.territory
      })(lieuxMediationNumerique);
    });
