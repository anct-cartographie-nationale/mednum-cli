import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DuplicationComparison, Groups, MergedLieuxByGroupMap } from '../steps';

export type DeduplicationRepository = {
  save: (
    groups: Groups,
    merged: MergedLieuxByGroupMap,
    lieuxToDeduplicate?: SchemaLieuMediationNumerique[],
    duplications?: DuplicationComparison[]
  ) => Promise<void>;
  isIncluded: (lieu: SchemaLieuMediationNumerique) => boolean;
};
