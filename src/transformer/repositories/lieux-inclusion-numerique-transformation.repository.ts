import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DiffSinceLastTransform, Fingerprint } from '../cli/diff-since-last-transform';
import { Erp, FindCommune, IsInQpv, IsInZrr } from '../fields';
import { DataSource, LieuxMediationNumeriqueMatching } from '../input';
import { Report } from '../report';

export type LieuxDeMediationNumeriqueTransformationRepository = {
  config: LieuxMediationNumeriqueMatching;
  accesLibre: Erp[];
  findCommune: FindCommune;
  isInQpv: IsInQpv;
  isInZrr: IsInZrr;
  fingerprints: Fingerprint[];
  writeErrors: (report: Report) => void;
  writeOutputs: (lieuxDeMediationNumeriqueFiltered: Record<string, LieuMediationNumerique>) => void;
  diffSinceLastTransform: (sourceItems: DataSource[]) => DiffSinceLastTransform;
  writeFingerprints: (diffSinceLastTransform: DiffSinceLastTransform) => void;
};
