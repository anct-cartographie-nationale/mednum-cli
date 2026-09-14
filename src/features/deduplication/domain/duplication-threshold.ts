import type { DuplicationComparison } from './duplication-comparisons';

/**
 * Un rapprochement entre deux lieux d'une même source demande plus de certitude qu'entre deux
 * sources différentes : à l'intérieur d'une source, deux antennes voisines se ressemblent
 * beaucoup sans être le même lieu.
 */
const INTERNAL_DUPLICATION_SCORE_THRESHOLD = 90 as const;
const DUPLICATION_SCORE_THRESHOLD = 80 as const;

export const duplicationScoreThreshold = (allowInternalMerge: boolean): number =>
  allowInternalMerge ? INTERNAL_DUPLICATION_SCORE_THRESHOLD : DUPLICATION_SCORE_THRESHOLD;

export const overDuplicationScoreThreshold =
  (allowInternalMerge: boolean) =>
  (duplicationComparison: DuplicationComparison): boolean =>
    duplicationComparison.score > duplicationScoreThreshold(allowInternalMerge);
