import type { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { Output } from '../../../libraries/file-system/index.js';

/**
 * Écrit les métadonnées de publication à côté des sorties. La déduplication déclare ici ce
 * dont elle a besoin ; c'est le point d'entrée qui y branche la capacité de publication, sans
 * que les deux capacités se connaissent.
 */
export type WritePublicationMetadata = (
  producer: Output,
  lieuxDeMediationNumerique: LieuMediationNumerique[],
  suffix?: string
) => void;
