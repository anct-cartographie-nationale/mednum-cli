import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Groups } from '../group-duplicates/group-duplicates';
import { mergeLieux, mergeOldLieux } from './merge-lieux';

const DAYS_IN_YEAR: 365 = 365 as const;
const MILLISECONDS_IN_DAY: number = 24 * 60 * 60 * 1000;
const DATE_LIMIT_OFFSET: number = (DAYS_IN_YEAR / 2) * MILLISECONDS_IN_DAY;

const onlyMatchingGroupIds =
  (ids: string[]) =>
  (lieu: SchemaLieuMediationNumerique): boolean =>
    ids.includes(lieu.id);

const byDate = (lieuA: SchemaLieuMediationNumerique, lieuB: SchemaLieuMediationNumerique): number =>
  lieuB.date_maj.localeCompare(lieuA.date_maj);

const isTooOld =
  (now: Date) =>
  (lieu: SchemaLieuMediationNumerique): boolean =>
    new Date(lieu.date_maj).getTime() < now.getTime() - DATE_LIMIT_OFFSET;

const toMergedLieu =
  (now: Date) =>
  (
    mergedLieu: SchemaLieuMediationNumerique | null,
    lieu: SchemaLieuMediationNumerique
  ): SchemaLieuMediationNumerique | null => {
    if (mergedLieu == null) return lieu;
    return isTooOld(now)(mergedLieu) || isTooOld(now)(lieu) ? mergeOldLieux(mergedLieu, lieu) : mergeLieux(mergedLieu, lieu);
  };

const idsInGroupsToMergedLieux =
  (lieux: SchemaLieuMediationNumerique[], now: Date) =>
  (mergedLieux: SchemaLieuMediationNumerique[], [, groupIds]: [string, string[]]): SchemaLieuMediationNumerique[] => {
    const lieu: SchemaLieuMediationNumerique | null = lieux
      .filter(onlyMatchingGroupIds(groupIds))
      .sort(byDate)
      .reduce(toMergedLieu(now), null);
    return lieu == null ? mergedLieux : [...mergedLieux, lieu];
  };

export const mergeDuplicates =
  (now: Date) =>
  (lieux: SchemaLieuMediationNumerique[], groups: Groups): SchemaLieuMediationNumerique[] =>
    Array.from(groups.mergeGroupsMap.entries()).reduce(idsInGroupsToMergedLieux(lieux, now), []);
