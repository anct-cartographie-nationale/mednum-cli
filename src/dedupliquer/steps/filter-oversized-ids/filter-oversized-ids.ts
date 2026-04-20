import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { MergedLieuxByGroupMap } from '../merge-duplicates/merge-duplicates';

const MAX_ID_BYTES = 2704;

export const filterOversizedIds = (merged: MergedLieuxByGroupMap): MergedLieuxByGroupMap => {
  const filtered = new Map<string, SchemaLieuMediationNumerique>();
  const oversizedIds: string[] = [];
  Array.from(merged.entries()).forEach(([key, lieu]) => {
    if (Buffer.byteLength(lieu.id, 'utf-8') > MAX_ID_BYTES) {
      oversizedIds.push(lieu.id);
    } else {
      filtered.set(key, lieu);
    }
  });
  if (oversizedIds.length > 0) {
    console.log(`- lieux exclus car id trop long (>${MAX_ID_BYTES} octets) : ${oversizedIds.length}`);
    for (const id of oversizedIds) {
      console.log(`  - ${id} (${Buffer.byteLength(id, 'utf-8')} octets)`);
    }
  }
  return filtered;
};
