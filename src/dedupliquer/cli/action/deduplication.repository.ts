import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { saveInFiles, saveWithApi } from '../data';
import { DuplicationComparison, Groups, MergedLieuxByGroupMap } from '../../steps';
import { DeduplicationRepository } from '../../repositories';
import { DedupliquerOptions } from '../dedupliquer-options';

export const deduplicationRepository = (dedupliquerOptions: DedupliquerOptions): DeduplicationRepository => ({
  save: async (
    groups: Groups,
    merged: MergedLieuxByGroupMap,
    lieuxToDeduplicate: SchemaLieuMediationNumerique[] = [],
    duplications: DuplicationComparison[] = []
  ): Promise<void> => {
    if (dedupliquerOptions.cartographieNationaleApiKey == null) {
      saveInFiles(dedupliquerOptions)(groups, merged, lieuxToDeduplicate, duplications);
    } else {
      await saveWithApi(dedupliquerOptions)(groups, merged);
    }
  }
});
