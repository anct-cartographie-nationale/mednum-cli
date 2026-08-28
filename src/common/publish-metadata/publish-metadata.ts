import * as fs from 'node:fs';
import type { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { createFolderIfNotExist, type Output, throwWriteFileError } from '../output-file';
import { generatePublishMetadata } from './generate-publish-metadata/generate-publish-metadata';

export const writePublierMetadataOutput = (
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
