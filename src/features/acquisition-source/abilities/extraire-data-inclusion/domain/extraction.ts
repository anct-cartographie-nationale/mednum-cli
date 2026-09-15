import type { SchemaServiceDataInclusion, SchemaStructureDataInclusion } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { DataInclusionMerged } from './data-inclusion-merged';
import { structuresWithServicesNumeriques } from './merge-services-in-structure';

export type DataInclusionExtraction = {
  structures: SchemaStructureDataInclusion[];
  services: SchemaServiceDataInclusion[];
};

const onlyMatchingSource =
  (source?: string) =>
  (item: DataInclusionMerged): boolean =>
    source == null ? true : item.source === source;

/**
 * Fusionne chaque structure avec ses services numériques, puis ne retient que les
 * enregistrements dont la source correspond au filtre demandé.
 */
export const extractionFor =
  (filter: string) =>
  ({ structures, services }: DataInclusionExtraction): DataInclusionMerged[] =>
    structuresWithServicesNumeriques(structures, services).filter(onlyMatchingSource(filter));
