import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Groups } from '../group-duplicates/group-duplicates';

export const removeMerged = (lieux: SchemaLieuMediationNumerique[], groups: Groups): SchemaLieuMediationNumerique[] =>
  lieux.filter((lieu: SchemaLieuMediationNumerique): boolean => !groups.itemGroupMap.has(lieu.id));
