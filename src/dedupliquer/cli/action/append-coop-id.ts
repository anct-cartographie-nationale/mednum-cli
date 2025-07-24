import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';

export const appendCoopId = (
  lieu: SchemaLieuMediationNumerique
): SchemaLieuMediationNumerique | (SchemaLieuMediationNumerique & { structure_coop_id: string }) => {
  const coopIds = lieu.id.match(/Coop-numérique_([^_]+)/);
  return coopIds ? { ...lieu, structure_coop_id: coopIds[1] } : lieu;
};
