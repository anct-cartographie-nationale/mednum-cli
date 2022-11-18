import { SchemaServiceDataInclusion, SchemaStructureDataInclusion } from '@gouvfr-anct/lieux-de-mediation-numerique';

export type DataInclusionMerged = {
  structure: SchemaStructureDataInclusion;
  services: SchemaServiceDataInclusion[];
};

const onlyMatchingStructureId =
  (structureId: string) =>
  (service: SchemaServiceDataInclusion): boolean =>
    service.structure_id === structureId;

export const mergeServicesInStructure = (
  services: SchemaServiceDataInclusion[],
  structure: SchemaStructureDataInclusion
): DataInclusionMerged => ({
  services: services.filter(onlyMatchingStructureId(structure.id)),
  structure
});
