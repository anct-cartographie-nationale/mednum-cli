import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DuplicationComparison, duplicationComparisons } from '../duplication-comparisons';
import { applyDuplicationRules, Duplication } from './duplication-rules';
import { mergeLieux, mergeOldLieux } from './merge-lieux';

const DAYS_IN_YEAR: 365 = 365 as const;
const MILLISECONDS_IN_DAY: number = 24 * 60 * 60 * 1000;
const DATE_LIMIT_OFFSET: number = (DAYS_IN_YEAR / 2) * MILLISECONDS_IN_DAY;

const DUPLICATION_SCORE_THRESHOLD: 60 = 60 as const;

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

const toDuplicates =
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

export const removeDuplicates =
  (now: Date) =>
  (lieux: SchemaLieuMediationNumerique[]): SchemaLieuMediationNumerique[] =>
    applyRemoveAndMergeRules(
      lieux,
      duplicationComparisons(lieux).filter(onlyMoreThanDuplicationScoreThreshold).map(toDuplicates(now)(lieux))
    );
