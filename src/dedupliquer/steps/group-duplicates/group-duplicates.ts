import { createHash } from 'node:crypto';
import { DuplicationComparison } from '../duplication-comparisons';

export type Groups = {
  mergeGroupsMap: Map<string, string[]>;
  itemGroupMap: Map<string, string>;
};

const createGroup =
  ({ mergeGroupsMap, itemGroupMap }: Groups) =>
  ({ id1, id2 }: DuplicationComparison, groupId: string): Groups => ({
    mergeGroupsMap: mergeGroupsMap.set(groupId, [id1, id2]),
    itemGroupMap: itemGroupMap.set(id1, groupId).set(id2, groupId)
  });

const updateGroup =
  ({ mergeGroupsMap, itemGroupMap }: Groups) =>
  (id1: string, id2: string, groupId: string): Groups => ({
    mergeGroupsMap: mergeGroupsMap.set(groupId, Array.from(new Set([...(mergeGroupsMap.get(groupId) ?? []), id1, id2])).sort()),
    itemGroupMap: itemGroupMap.set(id2, groupId)
  });

const getMergedGroupsIds = (mergeGroupsMap: Map<string, string[]>, groupId2: string, groupId1: string): string[] =>
  Array.from(new Set([...(mergeGroupsMap.get(groupId2) ?? []), ...(mergeGroupsMap.get(groupId1) ?? [])]));

const mergeGroups =
  (readyToMerge: Groups) =>
  (groupId2: string, groupId1: string): Groups => {
    const mergedGroupsIds: string[] = getMergedGroupsIds(readyToMerge.mergeGroupsMap, groupId2, groupId1);

    readyToMerge.mergeGroupsMap.delete(groupId1);
    readyToMerge.mergeGroupsMap.set(groupId2, mergedGroupsIds);
    mergedGroupsIds.forEach((id: string): Map<string, string> => readyToMerge.itemGroupMap.set(id, groupId2));

    return readyToMerge;
  };

const toGroups = (groups: Groups, duplicationComparison: DuplicationComparison, index: number): Groups => {
  const groupId1: string | undefined = groups.itemGroupMap.get(duplicationComparison.id1);
  const groupId2: string | undefined = groups.itemGroupMap.get(duplicationComparison.id2);

  if (groupId1 != null && groupId2 != null) return mergeGroups(groups)(groupId2, groupId1);
  if (groupId1 != null) return updateGroup(groups)(duplicationComparison.id1, duplicationComparison.id2, groupId1);
  if (groupId2 != null) return updateGroup(groups)(duplicationComparison.id2, duplicationComparison.id1, groupId2);

  return createGroup(groups)(duplicationComparison, index.toString());
};

const useIdsInGroupsHashesAsGroupIds = (groups: Groups): Groups => {
  const groupsWithHashes: Groups = {
    mergeGroupsMap: new Map<string, string[]>(),
    itemGroupMap: new Map<string, string>()
  };

  groups.mergeGroupsMap.forEach((ids: string[]): void => {
    const idsHash: string = createHash('sha256').update(ids.toString()).digest('hex');
    groupsWithHashes.mergeGroupsMap.set(idsHash, ids);
    ids.forEach((id: string): Map<string, string> => groupsWithHashes.itemGroupMap.set(id, idsHash));
  });

  return groupsWithHashes;
};

export const groupDuplicates = (duplicates: DuplicationComparison[]): Groups =>
  useIdsInGroupsHashesAsGroupIds(
    duplicates.reduce(
      (groups: Groups, duplicationComparison: DuplicationComparison, index: number): Groups =>
        toGroups(groups, duplicationComparison, index),
      {
        mergeGroupsMap: new Map<string, string[]>(),
        itemGroupMap: new Map<string, string>()
      }
    )
  );
