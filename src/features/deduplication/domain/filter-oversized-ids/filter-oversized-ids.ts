import type { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { MergedLieuxByGroupMap } from '../merge-duplicates/merge-duplicates';

/**
 * DynamoDB refuse une clé de partition au delà de cette taille : un lieu fusionné dont l'id
 * cumulé dépasse la limite ne peut pas être enregistré.
 */
export const MAX_ID_BYTES = 2704;

export type FilteredMergedLieux = {
  merged: MergedLieuxByGroupMap;
  oversizedIds: string[];
};

const idSizeOf = (id: string): number => Buffer.byteLength(id, 'utf-8');

const isOversized = ([, lieu]: [string, SchemaLieuMediationNumerique]): boolean => idSizeOf(lieu.id) > MAX_ID_BYTES;

export const describeOversizedId = (id: string): string => `  - ${id} (${idSizeOf(id)} octets)`;

export const filterOversizedIds = (merged: MergedLieuxByGroupMap): FilteredMergedLieux => {
  const entries: [string, SchemaLieuMediationNumerique][] = Array.from(merged.entries());

  return {
    merged: new Map(entries.filter((entry: [string, SchemaLieuMediationNumerique]): boolean => !isOversized(entry))),
    oversizedIds: entries.filter(isOversized).map(([, lieu]: [string, SchemaLieuMediationNumerique]): string => lieu.id)
  };
};
