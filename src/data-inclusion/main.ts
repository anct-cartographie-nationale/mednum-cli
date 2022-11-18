/* eslint-disable @typescript-eslint/no-restricted-imports,no-undef */

import * as fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;
import {
  CodeInseeError,
  CommuneError,
  fromSchemaDataInclusion,
  LieuMediationNumerique,
  MandatorySiretOrRnaError,
  SchemaServiceDataInclusion,
  SchemaStructureDataInclusion,
  ServicesError
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DataInclusionMerged, mergeServicesInStructure } from './merge-services-in-structure';
import { writeOutputFiles } from '../tools';

const SOURCE_PATH: string = './assets/input/';
const DATA_INCLUSION_STRUCTURES_FILE: string = 'data-inclusion-structures.json';
const DATA_INCLUSION_SERVICES_FILE: string = 'data-inclusion-services.json';

const ID: string = 'data-inclusion'; // todo: remplacer par le SIREN
const NAME: string = 'data-inclusion';
const TERRITOIRE: string = 'france';

const onlyDefindedLieuxMediationNumerique = (
  lieuMediationNumerique?: LieuMediationNumerique
): lieuMediationNumerique is LieuMediationNumerique => lieuMediationNumerique != null;

const toLieuxDeMediationNumerique =
  (dataInclusionServices: SchemaServiceDataInclusion[]) =>
  (structure: SchemaStructureDataInclusion): LieuMediationNumerique | undefined => {
    try {
      const dataInclusionMerged: DataInclusionMerged = mergeServicesInStructure(dataInclusionServices, structure);
      return fromSchemaDataInclusion(dataInclusionMerged.services, dataInclusionMerged.structure);
    } catch (error: unknown) {
      if (error instanceof ServicesError) return undefined;
      if (error instanceof CommuneError) return undefined;
      if (error instanceof MandatorySiretOrRnaError) return undefined;
      if (error instanceof CodeInseeError) return undefined;

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

        const lieuxDeMediationNumerique: LieuMediationNumerique[] = dataInclusionStructures
          .map(toLieuxDeMediationNumerique(dataInclusionServices))
          .filter(onlyDefindedLieuxMediationNumerique);

        writeOutputFiles({
          id: ID,
          name: NAME,
          territoire: TERRITOIRE
        })(lieuxDeMediationNumerique);
      }
    );
  }
);
