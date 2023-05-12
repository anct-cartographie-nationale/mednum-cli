import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DuplicationComparison, duplicationComparisons } from '../duplication-comparisons';

const DUPLICATION_SCORE_THRESHOLD: 60 = 60 as const;

const onlyNonDuplicates =
  (idToRemove: string[]) =>
  (lieu: SchemaLieuMediationNumerique): boolean =>
    !idToRemove.includes(lieu.id);

const onlyMoreThanDuplicationScoreThreshold = (duplicationComparison: DuplicationComparison): boolean =>
  duplicationComparison.score > DUPLICATION_SCORE_THRESHOLD;

const byId =
  (id: string) =>
  (lieu: SchemaLieuMediationNumerique): boolean =>
    lieu.id === id;

const selectIdToRemove = (lieu1?: SchemaLieuMediationNumerique, lieu2?: SchemaLieuMediationNumerique): string => {
  if (lieu1 == null || lieu2 == null) return '';

  return lieu1.date_maj < lieu2.date_maj ? lieu1.id : lieu2.id;
};

const toIdToRemove =
  (lieux: SchemaLieuMediationNumerique[]) =>
  (duplicationComparison: DuplicationComparison): string =>
    selectIdToRemove(lieux.find(byId(duplicationComparison.id1)), lieux.find(byId(duplicationComparison.id2)));

export const removeDuplicates = (lieux: SchemaLieuMediationNumerique[]): SchemaLieuMediationNumerique[] =>
  lieux.filter(
    onlyNonDuplicates(duplicationComparisons(lieux).filter(onlyMoreThanDuplicationScoreThreshold).map(toIdToRemove(lieux)))
  );
