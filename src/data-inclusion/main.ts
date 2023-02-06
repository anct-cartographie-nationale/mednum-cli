/* eslint-disable @typescript-eslint/no-restricted-imports,max-lines-per-function,@typescript-eslint/naming-convention, camelcase */

import * as fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;
import {
  CommuneError,
  fromSchemaDataInclusion,
  LieuMediationNumerique,
  MandatorySiretOrRnaError,
  SchemaServiceDataInclusion,
  SchemaStructureDataInclusion,
  ServicesError,
  UrlError,
  VoieError
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DataInclusionMerged, mergeServicesInStructure } from './merge-services-in-structure';
import { writeOutputFiles } from '../transformer/output';

const SOURCE_PATH: string = './assets/input/';
const DATA_INCLUSION_STRUCTURES_FILE: string = 'data-inclusion-structures.json';
const DATA_INCLUSION_SERVICES_FILE: string = 'data-inclusion-services.json';

const NAME: string = 'data-inclusion';
const TERRITOIRE: string = 'france';

const onlyDefindedLieuxMediationNumerique = (
  lieuMediationNumerique?: LieuMediationNumerique
): lieuMediationNumerique is LieuMediationNumerique => lieuMediationNumerique != null;

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

const toLieuxDeMediationNumerique =
  (dataInclusionServices: SchemaServiceDataInclusion[]) =>
  (structure: SchemaStructureDataInclusion): LieuMediationNumerique | undefined => {
    try {
      const dataInclusionMerged: DataInclusionMerged = mergeServicesInStructure(dataInclusionServices, structure);
      return fromSchemaDataInclusion(dataInclusionMerged.services, dataInclusionMerged.structure);
    } catch (error: unknown) {
      if (error instanceof Error && invalidLieuErrors.some(matchActual(error))) return undefined;

      // throw error;
      // imo: We don't want to throw the error here because we already do a validity check in the transformation script.
      // We could throw the error after modifying the lib to merge structures and services without a validity check
      // to avoid a double check and use this script to the futur only for merge structures/services and let tranformation
      // script do the job of validity check.
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

        const lieuxDeMediationNumerique: LieuMediationNumerique[] = dataInclusionStructures
          .map(toLieuxDeMediationNumerique(dataInclusionServices))
          .filter(onlyDefindedLieuxMediationNumerique);

        writeOutputFiles({
          path: `./assets/output/${NAME}`,
          name: NAME,
          territoire: TERRITOIRE
        })(lieuxDeMediationNumerique);
      }
    );
  }
);
