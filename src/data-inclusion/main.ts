/* eslint-disable @typescript-eslint/no-restricted-imports,no-undef,max-lines-per-function,@typescript-eslint/naming-convention, camelcase */

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
import { processCommune, processVoie } from './fields';

const SOURCE_PATH: string = './assets/input/';
const DATA_INCLUSION_STRUCTURES_FILE: string = 'data-inclusion-structures.json';
const DATA_INCLUSION_SERVICES_FILE: string = 'data-inclusion-services.json';

const ID: string = 'data-inclusion'; // todo: remplacer par le SIREN
const NAME: string = 'data-inclusion';
const TERRITOIRE: string = 'france';

const onlyDefindedLieuxMediationNumerique = (
  lieuMediationNumerique?: LieuMediationNumerique
): lieuMediationNumerique is LieuMediationNumerique => lieuMediationNumerique != null;

const processFields = (structure: SchemaStructureDataInclusion): SchemaStructureDataInclusion => ({
  id: structure.id,
  siret: structure.siret,
  rna: structure.rna,
  nom: structure.nom,
  commune: processCommune(structure.commune),
  code_postal: structure.code_postal,
  code_insee: structure.code_insee,
  adresse: processVoie(structure.adresse),
  complement_adresse: structure.complement_adresse,
  longitude: structure.longitude,
  latitude: structure.latitude,
  typologie: structure.typologie,
  telephone: structure.telephone,
  courriel: structure.courriel,
  site_web: structure.site_web,
  presentation_resume: structure.presentation_resume,
  presentation_detail: structure.presentation_detail,
  source: structure.source,
  date_maj: structure.date_maj,
  lien_source: structure.lien_source,
  horaires_ouverture: structure.horaires_ouverture,
  accessibilite: structure.accessibilite,
  labels_nationaux: structure.labels_nationaux,
  labels_autres: structure.labels_autres,
  thematiques: structure.thematiques
});

const toLieuxDeMediationNumerique =
  (dataInclusionServices: SchemaServiceDataInclusion[]) =>
  (structure: SchemaStructureDataInclusion): LieuMediationNumerique | undefined => {
    try {
      const dataInclusionMerged: DataInclusionMerged = mergeServicesInStructure(dataInclusionServices, structure);
      return fromSchemaDataInclusion(dataInclusionMerged.services, processFields(dataInclusionMerged.structure));
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
