import type { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { Output } from '../../../../libraries/file-system';
import type { WritePublicationMetadata } from '../../keys';
import { writeOutputFiles } from '../write-output-files';

export const saveOutputsInFiles =
  (producer: Output, writePublicationMetadata: WritePublicationMetadata) =>
  async (lieuxMediationNumerique: LieuMediationNumerique[], suffix?: string): Promise<void> =>
    Promise.resolve().then((): void => {
      writeOutputFiles(producer, writePublicationMetadata)(lieuxMediationNumerique, suffix);
    });
