/* eslint-disable @typescript-eslint/no-restricted-imports,max-lines-per-function,@typescript-eslint/naming-convention, camelcase, @typescript-eslint/no-explicit-any, max-lines */

import * as fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;
import {
  CommuneError,
  MandatorySiretOrRnaError,
  SchemaServiceDataInclusion,
  SchemaStructureDataInclusion,
  ServicesError,
  Url,
  UrlError,
  VoieError
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DataInclusionMerged, mergeServicesInStructure } from './merge-services-in-structure';

type SchemaStructureDataInclusionWithServices = SchemaStructureDataInclusion & {
  services: string;
  labels_nat: string;
  labels_autre: string;
};

const SOURCE_PATH: string = './assets/input/';
const DATA_INCLUSION_STRUCTURES_FILE: string = 'data-inclusion-structures.json';
const DATA_INCLUSION_SERVICES_FILE: string = 'data-inclusion-services.json';

const NAME: string = 'data-inclusion';

const onlyDefindedSchemaStructureDataInclusion = (
  schemaStructureDataInclusion?: SchemaStructureDataInclusionWithServices
): schemaStructureDataInclusion is SchemaStructureDataInclusionWithServices => schemaStructureDataInclusion != null;

const onlyWithServices = (schemaStructureDataInclusion: SchemaStructureDataInclusionWithServices): boolean =>
  schemaStructureDataInclusion.services.includes('numerique');

const mergeThematiques = (thematiques?: string[], thematiquesToAdd?: string[]): { thematiques: string[] } => ({
  thematiques: Array.from(new Set([...(thematiques ?? []), ...(thematiquesToAdd ?? [])]))
});

const mergeProfils = (profils?: string[], profilsToAdd?: string[]): { profils: string[] } => ({
  profils: Array.from(new Set([...(profils ?? []), ...(profilsToAdd ?? [])]))
});

const mergeTypes = (types?: string[], typesToAdd?: string[]): { types: string[] } => ({
  types: Array.from(new Set([...(types ?? []), ...(typesToAdd ?? [])]))
});

const mergePriseRdv = (priseRdv?: string, priseRdvToAdd?: string): { prise_rdv?: string } =>
  priseRdv == null && priseRdvToAdd == null ? {} : { prise_rdv: priseRdvToAdd ?? priseRdv ?? '' };

const fraisIfDefined = (frais?: string[]): { frais?: string[] } => (frais == null ? {} : { frais });

const mergeFrais = (frais?: string[], fraisToAdd?: string[]): { frais?: string[] } =>
  fraisIfDefined(Array.from(new Set([...(frais ?? []), ...(fraisToAdd ?? [])])));

const toSingleService = (
  mergedService: SchemaServiceDataInclusion,
  service: SchemaServiceDataInclusion
): SchemaServiceDataInclusion => ({
  ...mergedService,
  ...mergeThematiques(mergedService.thematiques, service.thematiques),
  ...mergeFrais(mergedService.frais, service.frais),
  ...mergeProfils(mergedService.profils, service.profils),
  ...mergeTypes(mergedService.types, service.types),
  ...mergePriseRdv(mergedService.prise_rdv, service.prise_rdv)
});

const mergeServices = (
  services: SchemaServiceDataInclusion[],
  structure: SchemaStructureDataInclusion
): SchemaServiceDataInclusion =>
  services.reduce(toSingleService, {
    id: `${structure.id}-mediation-numerique`,
    nom: 'Médiation numérique',
    source: structure.source ?? '',
    structure_id: structure.id,
    thematiques: []
  });

const getPriseRdv = (priseRdv?: string): { prise_rdv?: Url } => (priseRdv == null ? {} : { prise_rdv: Url(priseRdv) });

const getPublicsAccueillis = (profils?: string[]): { publics_accueillis?: string } =>
  profils == null || profils.length === 0
    ? {}
    : {
        publics_accueillis: profils.map((profil: string): string => profil).join(';')
      };

const getServices = (thematiques?: string[]): { services: string } => ({
  services: thematiques?.map((thematique: string): string => thematique).join(';') ?? ''
});

const getModalitesAccompagnement = (types?: string[]): { modalites_accompagnement?: string } =>
  types == null || types.length === 0
    ? {}
    : {
        modalites_accompagnement: types.map((type: string): string => type).join(';')
      };

const getFrais = (conditionAcces?: string[]): { conditions_acces?: string } =>
  conditionAcces == null || conditionAcces.length === 0
    ? {}
    : {
        conditions_acces: conditionAcces.map((frais: string): string => frais).join(';')
      };

const processFields = (
  structure: SchemaStructureDataInclusion,
  service: SchemaServiceDataInclusion
): SchemaStructureDataInclusionWithServices => ({
  ...structure,
  date_maj: new Date(structure.date_maj).toLocaleDateString('fr'),
  labels_nat: structure.labels_nationaux?.join(';') ?? '',
  labels_autre: structure.labels_autres?.join(';') ?? '',
  ...getServices(service.thematiques),
  ...getPublicsAccueillis(service.profils),
  ...getModalitesAccompagnement(service.types),
  ...getFrais(service.frais),
  ...getPriseRdv(service.prise_rdv)
});

const invalidLieuErrors: unknown[] = [
  UrlError, // todo: fix instead of drop
  VoieError,
  ServicesError,
  CommuneError,
  MandatorySiretOrRnaError
];

const matchActual =
  (error: Error) =>
  (invalidLieuError: unknown): boolean =>
    error instanceof (invalidLieuError as typeof Error);

const toMergeDataInclusionWithServices =
  (dataInclusionServices: SchemaServiceDataInclusion[]) =>
  (structure: SchemaStructureDataInclusion): SchemaStructureDataInclusionWithServices | undefined => {
    try {
      const dataInclusionMerged: DataInclusionMerged = mergeServicesInStructure(dataInclusionServices, structure);
      return processFields(
        dataInclusionMerged.structure,
        mergeServices(dataInclusionMerged.services, dataInclusionMerged.structure)
      );
    } catch (error: unknown) {
      if (error instanceof Error && invalidLieuErrors.some(matchActual(error))) return undefined;

      throw error;
    }
  };

fs.readFile(
  `${SOURCE_PATH}${DATA_INCLUSION_STRUCTURES_FILE}`,
  'utf8',
  (_0: ErrnoException | null, dataInclusionStructuresString: string): void => {
    fs.readFile(
      `${SOURCE_PATH}${DATA_INCLUSION_SERVICES_FILE}`,
      'utf8',
      (_1: ErrnoException | null, dataInclusionServicesString: string): void => {
        const dataInclusionStructures: SchemaStructureDataInclusion[] = JSON.parse(dataInclusionStructuresString);
        const dataInclusionServices: SchemaServiceDataInclusion[] = JSON.parse(dataInclusionServicesString);

        const schemaDataInclusionWithServices: SchemaStructureDataInclusionWithServices[] = dataInclusionStructures
          .map(toMergeDataInclusionWithServices(dataInclusionServices))
          .filter(onlyDefindedSchemaStructureDataInclusion)
          .filter(onlyWithServices);

        fs.writeFileSync(`./assets/output/${NAME}.json`, JSON.stringify(schemaDataInclusionWithServices), 'utf8');
      }
    );
  }
);
