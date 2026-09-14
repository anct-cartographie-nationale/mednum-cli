import type { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { Output } from '../../../../libraries/file-system/index.js';
import type { WritePublicationMetadata } from '../../keys/index.js';
import { writeOutputFiles } from '../write-output-files.js';

export const saveOutputsInFiles =
  (producer: Output, writePublicationMetadata: WritePublicationMetadata) =>
  async (lieuxMediationNumerique: LieuMediationNumerique[], suffix?: string): Promise<void> =>
    Promise.resolve().then((): void => {
      writeOutputFiles(producer, writePublicationMetadata)(lieuxMediationNumerique, suffix);
    });
