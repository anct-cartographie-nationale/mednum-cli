import axios, { AxiosResponse } from 'axios';
import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';

import { DeduplicationRepository } from '../../repositories';
import {
  DuplicationComparison,
  duplicationComparisons,
  groupDuplicates,
  Groups,
  MergedLieuxByGroupMap,
  mergeDuplicates
} from '../../steps';
import { DedupliquerOptions } from '../dedupliquer-options';
import { deduplicationRepository } from './deduplication.repository';

const INTERNAL_DUPLICATION_SCORE_THRESHOLD: 90 = 90 as const;
const DUPLICATION_SCORE_THRESHOLD: 60 = 60 as const;

const onlyMoreThanDuplicationScoreThreshold =
  (allowInternalMerge: boolean) =>
  (duplicationComparison: DuplicationComparison): boolean =>
    duplicationComparison.score > (allowInternalMerge ? INTERNAL_DUPLICATION_SCORE_THRESHOLD : DUPLICATION_SCORE_THRESHOLD);

const noCache = (): string => Math.random().toString(16).slice(2, -1);

export const dedupliquerAction = async (dedupliquerOptions: DedupliquerOptions): Promise<void> => {
  const repository: DeduplicationRepository = await deduplicationRepository(dedupliquerOptions);

  const lieux: AxiosResponse<SchemaLieuMediationNumerique[]> = await axios.get(
    dedupliquerOptions.baseSource.replace('$cache', noCache())
  );

  const lieuxToDeduplicate: AxiosResponse<SchemaLieuMediationNumerique[]> = await axios.get(
    dedupliquerOptions.source.replace('$cache', noCache())
  );

  const duplicationComparisonsToGroup: DuplicationComparison[] = duplicationComparisons(
    lieux.data,
    dedupliquerOptions.allowInternal,
    lieuxToDeduplicate.data
  ).filter(onlyMoreThanDuplicationScoreThreshold(dedupliquerOptions.allowInternal));

  const groups: Groups = groupDuplicates(duplicationComparisonsToGroup);
  const merged: MergedLieuxByGroupMap = mergeDuplicates(new Date())(lieux.data, groups);

  await repository.save(groups, merged, lieux.data);
};
