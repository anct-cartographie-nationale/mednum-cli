import type { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { DiffSinceLastTransform, Fingerprint } from '../cli/diff-since-last-transform';
import type { FindCommune, IsInFrr, IsInQpv } from '../../libraries/collectivites';
import type { Geocode } from '../fields';
import type { DataSource, LieuxMediationNumeriqueMatching } from '../input';
import type { Report } from '../report';
import type { AddressCache } from '../storage';

export type TransformationRepository = {
  config: LieuxMediationNumeriqueMatching;
  findCommune: FindCommune;
  isInQpv: IsInQpv;
  isInFrr: IsInFrr;
  geocode: Geocode;
  fingerprints: Fingerprint[];
  saveErrors: (report: Report) => void;
  saveAddresses: (addressCache: AddressCache) => void;
  saveOutputs: (lieuxDeMediationNumerique: LieuMediationNumerique[]) => Promise<void>;
  diffSinceLastTransform: (sourceItems: DataSource[]) => DiffSinceLastTransform;
  saveFingerprints: (diffSinceLastTransform: DiffSinceLastTransform) => Promise<void>;
};
