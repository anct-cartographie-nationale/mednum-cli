import {
  SchemaServiceDataInclusion,
  SchemaStructureDataInclusion,
  SchemaStructureDataInclusionAdresseFields,
  SchemaStructureDataInclusionLocalisationFields,
  isServiceWithAdresse,
  toStructureDataInclusion,
  SchemaServiceDataInclusionWithAdresse,
  mergeServices
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DataInclusionMerged, mergeStructureAndService } from './data-inclusion-merged';

export type DataInclusionStructureAndServices = {
  structure: SchemaStructureDataInclusion;
  services: SchemaServiceDataInclusion[];
};

const onlyWithNumeriqueServices = (service: SchemaServiceDataInclusion): boolean =>
  service.thematiques?.some((thematique: string): boolean => thematique.includes('numerique')) ?? false;

const matchingService =
  (service: SchemaServiceDataInclusion) =>
  (structure: SchemaStructureDataInclusion): boolean =>
    structure.id === service.structure_id && structure.source === service.source;

const toDataInclusionMerged = (dataInclusionStructureAndServices: DataInclusionStructureAndServices): DataInclusionMerged =>
  mergeStructureAndService(
    dataInclusionStructureAndServices.structure,
    mergeServices(dataInclusionStructureAndServices.services, dataInclusionStructureAndServices.structure)
  );

const onlyWithSameIdAs =
  (structure?: SchemaStructureDataInclusion) =>
  (dataInclusionStructureAndServices: DataInclusionStructureAndServices): boolean =>
    dataInclusionStructureAndServices.structure.id === structure?.id &&
    dataInclusionStructureAndServices.structure.source === structure.source;

const toDataInclusionStructuresWithNewService =
  (service: SchemaServiceDataInclusion, structure: SchemaStructureDataInclusion) =>
  (dataInclusionStructureAndServices: DataInclusionStructureAndServices): DataInclusionStructureAndServices =>
    dataInclusionStructureAndServices.structure.id === structure.id
      ? {
          structure: dataInclusionStructureAndServices.structure,
          services: [...dataInclusionStructureAndServices.services, service]
        }
      : dataInclusionStructureAndServices;

const appendService = (
  dataInclusionStructureAndServices: DataInclusionStructureAndServices[],
  service: SchemaServiceDataInclusion,
  structure: SchemaStructureDataInclusion
): DataInclusionStructureAndServices[] =>
  dataInclusionStructureAndServices.find(onlyWithSameIdAs(structure)) == null
    ? [...dataInclusionStructureAndServices, { services: [service], structure }]
    : dataInclusionStructureAndServices.map(toDataInclusionStructuresWithNewService(service, structure));

const serviceAsStructure = (
  dataInclusionStructureAndServices: DataInclusionStructureAndServices[],
  service: SchemaServiceDataInclusion,
  structure: SchemaStructureDataInclusion
): DataInclusionStructureAndServices[] => [
  ...dataInclusionStructureAndServices,
  { structure: toStructureDataInclusion(service as SchemaServiceDataInclusionWithAdresse, structure), services: [service] }
];

const updateDataInclusionStructuresAndServices = (
  service: SchemaServiceDataInclusion,
  dataInclusionStructureAndServices: DataInclusionStructureAndServices[],
  structure: SchemaStructureDataInclusion
): DataInclusionStructureAndServices[] =>
  isServiceWithAdresse(service)
    ? serviceAsStructure(dataInclusionStructureAndServices, service, structure)
    : appendService(dataInclusionStructureAndServices, service, structure);

const processStructureAndServices = (
  service: SchemaServiceDataInclusion,
  structure: SchemaStructureDataInclusion | undefined,
  dataInclusionStructureAndServices: DataInclusionStructureAndServices[]
): DataInclusionStructureAndServices[] =>
  structure == null
    ? dataInclusionStructureAndServices
    : updateDataInclusionStructuresAndServices(service, dataInclusionStructureAndServices, structure);

const toDataInclusionStructureAndServices =
  (dataInclusionStructures: SchemaStructureDataInclusion[]) =>
  (
    dataInclusionStructureAndServices: DataInclusionStructureAndServices[],
    service: Partial<SchemaStructureDataInclusionAdresseFields> &
      SchemaServiceDataInclusion &
      SchemaStructureDataInclusionLocalisationFields
  ): DataInclusionStructureAndServices[] =>
    processStructureAndServices(
      service,
      dataInclusionStructures.find(matchingService(service)),
      dataInclusionStructureAndServices
    );

export const structuresWithServicesNumeriques = (
  dataInclusionStructures: SchemaStructureDataInclusion[],
  dataInclusionServices: SchemaServiceDataInclusion[]
): DataInclusionMerged[] =>
  dataInclusionServices
    .filter(onlyWithNumeriqueServices)
    .reduce(toDataInclusionStructureAndServices(dataInclusionStructures), [])
    .map(toDataInclusionMerged);
