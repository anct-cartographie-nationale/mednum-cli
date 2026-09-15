import * as fs from 'node:fs';
import type { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { createFolderIfNotExist, type Output, throwWriteFileError } from '../../../libraries/file-system';
import { generatePublishMetadata } from '../domain';
import type { WritePublicationMetadata } from '../keys';

export const writePublicationMetadataInFile: WritePublicationMetadata = (
  producer: Output,
  lieuxDeMediationNumerique: LieuMediationNumerique[],
  suffix?: string
): void => {
  fs.writeFile(
    `${createFolderIfNotExist(producer.path)}/publier.json`,
    JSON.stringify(generatePublishMetadata(producer, lieuxDeMediationNumerique, new Date(), suffix)),
    throwWriteFileError
  );
};
