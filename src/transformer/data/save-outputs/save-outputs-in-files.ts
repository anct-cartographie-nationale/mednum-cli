import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { writeOutputFiles } from '../../output';

export const saveOutputsInFiles =
  (transformerOptions: { outputDirectory: string; sourceName: string; territory: string }) =>
  async (lieuxMediationNumerique: LieuMediationNumerique[], suffix?: string): Promise<void> =>
    Promise.resolve().then((): void => {
      writeOutputFiles({
        path: transformerOptions.outputDirectory,
        name: transformerOptions.sourceName,
        territoire: transformerOptions.territory
      })(lieuxMediationNumerique, suffix);
    });
