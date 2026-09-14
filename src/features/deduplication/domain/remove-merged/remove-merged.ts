import type { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { Groups } from '../group-duplicates/group-duplicates.js';

export const removeMerged = (lieux: SchemaLieuMediationNumerique[], groups: Groups): SchemaLieuMediationNumerique[] =>
  lieux.filter((lieu: SchemaLieuMediationNumerique): boolean => !groups.itemGroupMap.has(lieu.id));
