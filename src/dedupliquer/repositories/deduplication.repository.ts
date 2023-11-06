import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Groups, MergedLieuxByGroupMap } from '../steps';

export type DeduplicationRepository = {
  save: (groups: Groups, merged: MergedLieuxByGroupMap, lieuxToDeduplicate?: SchemaLieuMediationNumerique[]) => Promise<void>;
};
