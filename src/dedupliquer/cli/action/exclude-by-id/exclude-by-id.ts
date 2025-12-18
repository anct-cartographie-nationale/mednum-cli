import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';

export const excludeById =
  (idsToExclude: string[]) =>
  (lieu: SchemaLieuMediationNumerique): boolean =>
    !idsToExclude.includes(lieu.id);
