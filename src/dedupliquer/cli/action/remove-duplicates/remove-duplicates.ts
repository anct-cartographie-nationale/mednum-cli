import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DuplicationComparison, duplicationComparisons } from '../duplication-comparisons';
import { applyDuplicationRules, Duplication } from './duplication-rules';
import { mergeLieux, mergeOldLieux } from './merge-lieux';

const DAYS_IN_YEAR: 365 = 365 as const;
const MILLISECONDS_IN_DAY: number = 24 * 60 * 60 * 1000;
const DATE_LIMIT_OFFSET: number = (DAYS_IN_YEAR / 2) * MILLISECONDS_IN_DAY;

const DUPLICATION_SCORE_THRESHOLD: 60 = 60 as const;

export type Group = {
  id: string;
  lieuxIds: string[];
};

const onlyNonDuplicates =
  (idToRemove: string[]) =>
  (lieu: SchemaLieuMediationNumerique): boolean =>
    !idToRemove.includes(lieu.id);

const onlyMoreThanDuplicationScoreThreshold = (duplicationComparison: DuplicationComparison): boolean =>
  duplicationComparison.score > DUPLICATION_SCORE_THRESHOLD;

const onlyDefinedId = (id?: string): id is string => id != null;

const byId =
  (id: string) =>
  (lieu: SchemaLieuMediationNumerique): boolean =>
    lieu.id === id;

const byMergeId =
  (lieu: SchemaLieuMediationNumerique) =>
  (duplicate: Duplication): boolean =>
    duplicate.mergeId === lieu.id;

const byOldId =
  (lieu: SchemaLieuMediationNumerique) =>
  (duplicate: Duplication): boolean =>
    duplicate.oldId === lieu.id;

const toIdToRemove = (duplicate: Duplication): string | undefined => duplicate.id;

const toDuplicatesToRemove =
  (now: Date) =>
  (lieux: SchemaLieuMediationNumerique[]) =>
  (duplicationComparison: DuplicationComparison): Duplication =>
    applyDuplicationRules(new Date(now.getTime() - DATE_LIMIT_OFFSET))(
      lieux.find(byId(duplicationComparison.id1)),
      lieux.find(byId(duplicationComparison.id2))
    );

const toMergeWithDuplicates =
  (lieux: SchemaLieuMediationNumerique[], duplicateToMergeId?: string) =>
  (lieu: SchemaLieuMediationNumerique): SchemaLieuMediationNumerique =>
    duplicateToMergeId == null ? lieu : mergeLieux(lieu, lieux.find(byId(duplicateToMergeId)));

const toMergeWithOldDuplicates =
  (lieux: SchemaLieuMediationNumerique[], duplicateToMergeId?: string) =>
  (lieu: SchemaLieuMediationNumerique): SchemaLieuMediationNumerique =>
    duplicateToMergeId == null ? lieu : mergeOldLieux(lieu, lieux.find(byId(duplicateToMergeId)));

const applyRemoveAndMergeRules = (
  lieux: SchemaLieuMediationNumerique[],
  duplicates: Duplication[]
): SchemaLieuMediationNumerique[] =>
  lieux
    .filter(onlyNonDuplicates(duplicates.map(toIdToRemove).filter(onlyDefinedId)))
    .map(
      (lieu: SchemaLieuMediationNumerique): SchemaLieuMediationNumerique =>
        toMergeWithDuplicates(lieux, duplicates.find(byMergeId(lieu))?.id)(lieu)
    )
    .map(
      (lieu: SchemaLieuMediationNumerique): SchemaLieuMediationNumerique =>
        toMergeWithOldDuplicates(lieux, duplicates.find(byOldId(lieu))?.id)(lieu)
    );

const duplicatesToProcess = (lieux: SchemaLieuMediationNumerique[], now: Date): Duplication[] =>
  duplicationComparisons(lieux).filter(onlyMoreThanDuplicationScoreThreshold).map(toDuplicatesToRemove(now)(lieux));

export const removeDuplicates =
  (now: Date) =>
  (lieux: SchemaLieuMediationNumerique[]): SchemaLieuMediationNumerique[] =>
    applyRemoveAndMergeRules(lieux, duplicatesToProcess(lieux, now));

const allDefinedDuplicationIds = (duplication: Duplication): string[] =>
  [duplication.id, duplication.oldId, duplication.mergeId].filter(onlyDefinedId);

const atLeastOneMatchingDupliactionId =
  (duplication: Duplication) =>
  (group: Group): boolean =>
    (duplication.id != null && group.lieuxIds.includes(duplication.id)) ||
    (duplication.oldId != null && group.lieuxIds.includes(duplication.oldId)) ||
    (duplication.mergeId != null && group.lieuxIds.includes(duplication.mergeId));

const removeGroup =
  (groupToRemove?: Group) =>
  (group: Group): boolean =>
    group.id !== groupToRemove?.id;

const newGroup = (groupId: number, duplication: Duplication): Group => ({
  id: groupId.toString(),
  lieuxIds: allDefinedDuplicationIds(duplication)
});

const updateGroup = (existingGroup: Group, duplication: Duplication): Group => ({
  id: existingGroup.id,
  lieuxIds: Array.from(new Set([...existingGroup.lieuxIds, ...allDefinedDuplicationIds(duplication)]))
});

const toGroups = (groups: Group[], duplication: Duplication, groupId: number): Group[] => {
  const existingGroup: Group | undefined = groups.find(atLeastOneMatchingDupliactionId(duplication));

  return [
    ...groups.filter(removeGroup(existingGroup)),
    ...(existingGroup == null ? [newGroup(groupId, duplication)] : [updateGroup(existingGroup, duplication)])
  ];
};

export const findGroups =
  (now: Date) =>
  (lieux: SchemaLieuMediationNumerique[]): Group[] =>
    duplicatesToProcess(lieux, now).reduce(toGroups, []);
