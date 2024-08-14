import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DiffSinceLastTransform, Fingerprint } from '../cli/diff-since-last-transform';
import { Erp, FindCommune, IsInQpv, IsInZrr, Geocode } from '../fields';
import { DataSource, LieuxMediationNumeriqueMatching } from '../input';
import { Report } from '../report';

export type TransformationRepository = {
  config: LieuxMediationNumeriqueMatching;
  findCommune: FindCommune;
  isInQpv: IsInQpv;
  isInZrr: IsInZrr;
  geocode: Geocode;
  fingerprints: Fingerprint[];
  saveErrors: (report: Report) => void;
  saveOutputs: (lieuxDeMediationNumerique: LieuMediationNumerique[]) => Promise<void>;
  diffSinceLastTransform: (sourceItems: DataSource[]) => DiffSinceLastTransform;
  saveFingerprints: (diffSinceLastTransform: DiffSinceLastTransform) => Promise<void>;
};
