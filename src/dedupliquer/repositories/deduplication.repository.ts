import type { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { DuplicationComparison, Groups, MergedLieuxByGroupMap } from '../steps';

export type DeduplicationRepository = {
  save: (
    groups: Groups,
    merged: MergedLieuxByGroupMap,
    lieuxToDeduplicate?: SchemaLieuMediationNumerique[],
    duplications?: DuplicationComparison[]
  ) => Promise<void>;
  isIncluded: (lieu: SchemaLieuMediationNumerique) => boolean;
};
