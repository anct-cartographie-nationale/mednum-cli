import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DiffSinceLastTransform, Fingerprint } from '../cli/diff-since-last-transform';
import { FindCommune, IsInQpv, IsInZrr, Geocode } from '../fields';
import { DataSource, LieuxMediationNumeriqueMatching } from '../input';
import { Report } from '../report';
import { AddressCache } from '../storage';

export type TransformationRepository = {
  config: LieuxMediationNumeriqueMatching;
  findCommune: FindCommune;
  isInQpv: IsInQpv;
  isInZrr: IsInZrr;
  geocode: Geocode;
  fingerprints: Fingerprint[];
  saveErrors: (report: Report) => void;
  saveAddresses: (addressCache: AddressCache) => void;
  saveOutputs: (lieuxDeMediationNumerique: LieuMediationNumerique[]) => Promise<void>;
  diffSinceLastTransform: (sourceItems: DataSource[]) => DiffSinceLastTransform;
  saveFingerprints: (diffSinceLastTransform: DiffSinceLastTransform) => Promise<void>;
};
