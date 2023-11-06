import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Groups, MergedLieuxByGroupMap } from '../../../steps';

export type MergeGroupTransfer = {
  groupId: string;
  mergedIds: string[];
  lieu: SchemaLieuMediationNumerique;
};

const onlyDefined = <T>(canBeNull: T | undefined): canBeNull is T => canBeNull != null;

const mergeGroupTransferIfLieuExist = (
  groupId: string,
  mergedIds: string[],
  lieu?: SchemaLieuMediationNumerique
): MergeGroupTransfer | undefined => (lieu == null ? undefined : { groupId, mergedIds, lieu });

const toMergeGroupTransfer =
  (merged: Map<string, SchemaLieuMediationNumerique>) =>
  ([groupId, mergedIds]: [string, string[]]): MergeGroupTransfer | undefined =>
    mergeGroupTransferIfLieuExist(groupId, mergedIds, merged.get(groupId));

export const mergeGroupTransfers = (groups: Groups, merged: MergedLieuxByGroupMap): MergeGroupTransfer[] =>
  Array.from(groups.mergeGroupsMap.entries()).map(toMergeGroupTransfer(merged)).filter(onlyDefined);
