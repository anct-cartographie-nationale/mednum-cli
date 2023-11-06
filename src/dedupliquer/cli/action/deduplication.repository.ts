import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { saveInFiles, saveWithApi } from '../data';
import { Groups, MergedLieuxByGroupMap } from '../../steps';
import { DeduplicationRepository } from '../../repositories';
import { DedupliquerOptions } from '../dedupliquer-options';

export const deduplicationRepository = async (dedupliquerOptions: DedupliquerOptions): Promise<DeduplicationRepository> => {
  const useFile: boolean = dedupliquerOptions.cartographieNationaleApiKey == null;

  return {
    save: async (
      groups: Groups,
      merged: MergedLieuxByGroupMap,
      lieuxToDeduplicate: SchemaLieuMediationNumerique[] = []
    ): Promise<void> => {
      useFile
        ? saveInFiles(dedupliquerOptions)(lieuxToDeduplicate, groups, merged)
        : await saveWithApi(dedupliquerOptions)(groups, merged);
    }
  };
};
