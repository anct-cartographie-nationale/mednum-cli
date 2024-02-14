import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { paginate } from '../../../common';
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

/* eslint-disable-next-line max-statements, max-lines-per-function */
export const dedupliquerAction = async (dedupliquerOptions: DedupliquerOptions): Promise<void> => {
  try {
    const repository: DeduplicationRepository = deduplicationRepository(dedupliquerOptions);

    const allLieuxWithDuplicates: SchemaLieuMediationNumerique[] = await paginate<SchemaLieuMediationNumerique>(
      `${dedupliquerOptions.baseSource.split('?')[0]}?page[number]=0&page[size]=10000`,
      dedupliquerOptions.baseSource.split('?')[1]
    );

    const lieuxToDeduplicate: SchemaLieuMediationNumerique[] = await paginate<SchemaLieuMediationNumerique>(
      `${dedupliquerOptions.source.split('?')[0]}?page[number]=0&page[size]=10000`,
      dedupliquerOptions.source.split('?')[1]
    );

    const duplicationComparisonsToGroup: DuplicationComparison[] = duplicationComparisons(
      allLieuxWithDuplicates,
      dedupliquerOptions.allowInternal,
      lieuxToDeduplicate
    ).filter(onlyMoreThanDuplicationScoreThreshold(dedupliquerOptions.allowInternal));

    const groups: Groups = groupDuplicates(duplicationComparisonsToGroup);

    const merged: MergedLieuxByGroupMap = mergeDuplicates(new Date())(allLieuxWithDuplicates, groups);

    /* eslint-disable-next-line no-console */
    console.log('Nouveaux lieux concernés par une fusion :', groups.itemGroupMap.size);
    /* eslint-disable-next-line no-console */
    console.log('Nouveaux lieux fusionnés à enregistrer :', merged.size);

    await repository.save(groups, merged, allLieuxWithDuplicates);
  } catch (error) {
    /* eslint-disable-next-line no-console */
    console.log(error);
  }
};
