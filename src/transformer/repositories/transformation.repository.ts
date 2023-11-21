import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DiffSinceLastTransform, Fingerprint } from '../cli/diff-since-last-transform';
import { Erp, FindCommune, IsInQpv, IsInZrr } from '../fields';
import { DataSource, LieuxMediationNumeriqueMatching } from '../input';
import { Report } from '../report';

export type TransformationRepository = {
  config: LieuxMediationNumeriqueMatching;
  accesLibre: Erp[];
  findCommune: FindCommune;
  isInQpv: IsInQpv;
  isInZrr: IsInZrr;
  fingerprints: Fingerprint[];
  saveErrors: (report: Report) => void;
  saveOutputs: (lieuxDeMediationNumerique: LieuMediationNumerique[]) => Promise<void>;
  diffSinceLastTransform: (sourceItems: DataSource[]) => DiffSinceLastTransform;
  saveFingerprints: (diffSinceLastTransform: DiffSinceLastTransform) => Promise<void>;
};
