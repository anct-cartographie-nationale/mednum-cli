import type { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { Output } from '../../../libraries/file-system/index.js';
import { type InjectionKey, keyFor } from '../../../libraries/injection/index.js';
import type { PublishMetadata } from '../domain/index.js';

export type ReadPublicationMetadata = (metadataFile: string) => PublishMetadata | undefined;

export const READ_PUBLICATION_METADATA: InjectionKey<ReadPublicationMetadata> = keyFor<ReadPublicationMetadata>(
  'publication.read-publication-metadata'
);

export type WritePublicationMetadata = (
  producer: Output,
  lieuxDeMediationNumerique: LieuMediationNumerique[],
  suffix?: string
) => void;

export const WRITE_PUBLICATION_METADATA: InjectionKey<WritePublicationMetadata> = keyFor<WritePublicationMetadata>(
  'publication.write-publication-metadata'
);
