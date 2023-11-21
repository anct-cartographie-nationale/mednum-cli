import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Groups } from '../group-duplicates/group-duplicates';
import { MergedLieuxByGroupMap } from '../merge-duplicates';

export type MergeGroup = {
  groupId: string;
  mergedIds: string[];
  lieu: SchemaLieuMediationNumerique;
};

const onlyDefined = <T>(canBeNull: T | undefined): canBeNull is T => canBeNull != null;

const mergeGroupIfLieuExist = (
  groupId: string,
  mergedIds: string[],
  lieu?: SchemaLieuMediationNumerique
): MergeGroup | undefined => (lieu == null ? undefined : { groupId, mergedIds, lieu });

const toMergeGroup =
  (merged: Map<string, SchemaLieuMediationNumerique>) =>
  ([groupId, mergedIds]: [string, string[]]): MergeGroup | undefined =>
    mergeGroupIfLieuExist(groupId, mergedIds, merged.get(groupId));

export const mergeGroups = (groups: Groups, merged: MergedLieuxByGroupMap): MergeGroup[] =>
  Array.from(groups.mergeGroupsMap.entries()).map(toMergeGroup(merged)).filter(onlyDefined);

const hasMoreThanOneRemainingId = (mergedIds: string[], groups: Groups): boolean =>
  mergedIds.length - mergedIds.filter((id: string): boolean => groups.itemGroupMap.has(id)).length > 1;

const toIdsToDelete =
  (groups: Groups) =>
  (groupIdsToRemove: string[], { mergedIds, groupId }: MergeGroup): string[] =>
    hasMoreThanOneRemainingId(mergedIds, groups) ? groupIdsToRemove : [...groupIdsToRemove, groupId];

export const findGroupIdsToDelete =
  (mergedGroups: MergeGroup[]) =>
  (groups: Groups): string[] =>
    mergedGroups.reduce(toIdsToDelete(groups), []);
