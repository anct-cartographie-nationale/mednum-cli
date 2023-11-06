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

const DUPLICATION_SCORE_THRESHOLD: 60 = 60 as const;

const onlyMoreThanDuplicationScoreThreshold = (duplicationComparison: DuplicationComparison): boolean =>
  duplicationComparison.score > DUPLICATION_SCORE_THRESHOLD;

export const dedupliquerAction = async (dedupliquerOptions: DedupliquerOptions): Promise<void> => {
  const repository: DeduplicationRepository = await deduplicationRepository(dedupliquerOptions);

  const lieuxToDeduplicate: AxiosResponse<SchemaLieuMediationNumerique[]> = await axios.get(dedupliquerOptions.source);

  // todo: need to have preexisting groups as input
  // todo: need to use preexisting groups to initialize groups

  const duplicationComparisonsToGroup: DuplicationComparison[] = duplicationComparisons(lieuxToDeduplicate.data).filter(
    onlyMoreThanDuplicationScoreThreshold
  );

  const groups: Groups = groupDuplicates(duplicationComparisonsToGroup);
  const merged: MergedLieuxByGroupMap = mergeDuplicates(new Date())(lieuxToDeduplicate.data, groups);

  await repository.save(groups, merged, lieuxToDeduplicate.data);

  // console.log(groups.mergeGroupsMap);
  // console.log(merged);
  // console.log(mergeGroups);
};
