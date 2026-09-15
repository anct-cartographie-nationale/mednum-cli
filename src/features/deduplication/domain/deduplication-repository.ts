import type { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { DuplicationComparison } from './duplication-comparisons/index';
import type { Groups } from './group-duplicates/group-duplicates';
import type { MergedLieuxByGroupMap } from './merge-duplicates/index';

/**
 * Enregistre le résultat d'une déduplication, sans rien présumer de la destination : des
 * fichiers de sortie ou l'API de la cartographie nationale.
 */
export type SaveDeduplication = (
  groups: Groups,
  merged: MergedLieuxByGroupMap,
  lieuxToDeduplicate?: SchemaLieuMediationNumerique[],
  duplications?: DuplicationComparison[]
) => Promise<void>;

/**
 * Charge les lieux à dédupliquer, quelle que soit la forme de la source : fichier JSON,
 * fichier CSV, ou API paginée.
 */
export type LoadLieux = (source: string) => Promise<SchemaLieuMediationNumerique[]>;

export type IsIncluded = (lieu: SchemaLieuMediationNumerique) => boolean;
