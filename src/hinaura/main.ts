/* eslint-disable @typescript-eslint/naming-convention, camelcase, @typescript-eslint/no-restricted-imports, no-undef */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */

import * as fs from 'fs';
import { LieuMediationNumerique, Pivot, ServicesError, VoieError } from '@gouvfr-anct/lieux-de-mediation-numerique';
import {
  LieuxMediationNumeriqueMatching,
  processAdresse,
  processConditionsAcces,
  processContact,
  processDate,
  processHoraires,
  processId,
  processLocalisation,
  processModalitesAccompagnement,
  processNom,
  processPublicAccueilli,
  processServices,
  Recorder,
  Report,
  Source,
  writeOutputFiles
} from '../tools';
import ErrnoException = NodeJS.ErrnoException;

const report: Report = Report();

const SOURCE_PATH: string = './assets/input/';
const SOURCE_FILE: string = 'hinaura.json';
const CONFIG_FILE: string = 'hinaura.config.json';

const ID: string = 'hinaura'; // todo: remplacer par le SIREN
const NAME: string = 'Hinaura';
const TERRITOIRE: string = 'auvergne-rhone-alpes';

const lieuDeMediationNumerique = (
  index: number,
  source: Source,
  matching: LieuxMediationNumeriqueMatching,
  recorder: Recorder
): LieuMediationNumerique => {
  const lieuMediationNumerique: LieuMediationNumerique = {
    id: processId(source, matching, index),
    nom: processNom(source, matching),
    pivot: Pivot('00000000000000'),
    adresse: processAdresse(recorder)(source, matching),
    localisation: processLocalisation(source, matching),
    contact: processContact(recorder)(source, matching),
    conditions_acces: processConditionsAcces(source, matching),
    modalites_accompagnement: processModalitesAccompagnement(source, matching),
    date_maj: processDate(source, matching),
    publics_accueillis: processPublicAccueilli(source, matching),
    services: processServices(source, matching),
    source: NAME,
    horaires: processHoraires(recorder)(source, matching)?.toString() ?? ''
  };
  recorder.commit();
  return lieuMediationNumerique;
};
const validValuesOnly = (lieuDeMediationNumeriqueToValidate?: LieuMediationNumerique): boolean =>
  lieuDeMediationNumeriqueToValidate != null;

const toLieuxMediationNumerique =
  (matching: string) =>
  (source: Source, index: number): LieuMediationNumerique | undefined => {
    try {
      return lieuDeMediationNumerique(index, source, JSON.parse(matching), report.entry(index));
    } catch (error: unknown) {
      if (error instanceof ServicesError) return undefined;
      if (error instanceof VoieError) return undefined;
      throw error;
    }
  };

fs.readFile(`${SOURCE_PATH}${SOURCE_FILE}`, 'utf8', (_1: ErrnoException | null, dataString: string): void => {
  fs.readFile(`${SOURCE_PATH}${CONFIG_FILE}`, 'utf8', (_2: ErrnoException | null, matching: string): void => {
    const lieuxDeMediationNumerique: LieuMediationNumerique[] = JSON.parse(dataString)
      .map(toLieuxMediationNumerique(matching))
      .filter(validValuesOnly);

    writeOutputFiles({
      id: ID,
      name: NAME,
      territoire: TERRITOIRE
    })(lieuxDeMediationNumerique);

    // report.records().forEach((record) => {
    //   console.log(record.index);
    //   record.errors.forEach((reportError) => {
    //     console.log(reportError);
    //   });
    // });

    return undefined;
  });
});
