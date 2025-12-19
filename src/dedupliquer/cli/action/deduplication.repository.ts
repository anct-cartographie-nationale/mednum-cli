import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { saveInFiles, saveWithApi } from '../data';
import { DuplicationComparison, Groups, MergedLieuxByGroupMap } from '../../steps';
import { DeduplicationRepository } from '../../repositories';
import { DedupliquerOptions } from '../dedupliquer-options';
import { excludeById } from './exclude-by-id/exclude-by-id';

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
  },
  isIncluded: (lieu: SchemaLieuMediationNumerique): boolean =>
    excludeById([
      'Coop-numérique_fb1fa128-9b9a-49e2-8f19-3c9751c80f68',
      'France-Services_1819',
      'dora_bf60f3b4-d0d0-4f40-90e3-a999507dc070',
      'dora_ee2dc0e5-3d35-4dcb-9202-cc4df05f9ccd',
      'France-Services_1817',
      'France-Services_452',
      'dora_04361a45-4926-4760-a409-605dc71e3025',
      'France-Services_2506',
      'France-Services_2826',
      'dora_04b66816-f68a-404e-a083-216d9318c380',
      'dora_95174f8f-ed02-4b4c-93b7-b644a4ca838f',
      'dora_b67d0721-da50-412d-8b3f-b962bdf65bcf'
    ])(lieu)
});
