/* eslint-disable @typescript-eslint/naming-convention, camelcase, @typescript-eslint/no-restricted-imports, no-undef */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */

import * as fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;
import { LieuMediationNumerique, Pivot, ServicesError } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { processLocalisation, Recorder, Report, writeOutputFiles } from '../tools';
import { HinauraLieuMediationNumerique } from './helper';
import {
  processServices,
  processModalitesAccompagnement,
  processPublicAccueilli,
  processConditionsAccess,
  processContact,
  processAdresse,
  processDate,
  processHoraires
  // processLocalisation
} from './fields';

const SOURCE_PATH: string = './assets/input/';
const HINAURA_FILE: string = 'hinaura.json';
const report: Report = Report();

const toLieuDeMediationNumerique = (
  index: number,
  hinauraLieuMediationNumerique: HinauraLieuMediationNumerique,
  recorder: Recorder
): LieuMediationNumerique => {
  const lieuMediationNumerique: LieuMediationNumerique = {
    id: index.toString(),
    nom: hinauraLieuMediationNumerique['Nom du lieu ou de la structure *'],
    pivot: Pivot('00000000000000'),
    adresse: processAdresse(recorder)(hinauraLieuMediationNumerique),
    localisation: processLocalisation(hinauraLieuMediationNumerique.bf_latitude, hinauraLieuMediationNumerique.bf_longitude),
    contact: processContact(recorder)(hinauraLieuMediationNumerique),
    conditions_access: processConditionsAccess(hinauraLieuMediationNumerique),
    modalites_accompagnement: processModalitesAccompagnement(hinauraLieuMediationNumerique),
    date_maj: processDate(hinauraLieuMediationNumerique),
    publics_accueillis: processPublicAccueilli(hinauraLieuMediationNumerique),
    services: processServices(hinauraLieuMediationNumerique),
    source: 'Hinaura',
    horaires: processHoraires(recorder)(hinauraLieuMediationNumerique) as string
  };
  recorder.commit();
  return lieuMediationNumerique;
};
const validValuesOnly = (lieuDeMediationNumerique?: LieuMediationNumerique): boolean => lieuDeMediationNumerique != null;

const ID: string = 'hinaura'; // todo: remplacer par le SIREN
const NAME: string = 'hinaura';
const TERRITOIRE: string = 'auvergne-rhone-alpes';

fs.readFile(`${SOURCE_PATH}${HINAURA_FILE}`, 'utf8', (_: ErrnoException | null, dataString: string): void => {
  const lieuxDeMediationNumerique: LieuMediationNumerique[] = JSON.parse(dataString)
    .map((hinauraLieuMediationNumerique: HinauraLieuMediationNumerique, index: number): LieuMediationNumerique | undefined => {
      try {
        return toLieuDeMediationNumerique(index, hinauraLieuMediationNumerique, report.entry(index));
      } catch (error: unknown) {
        if (error instanceof ServicesError) return undefined;
        throw error;
      }
    })
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
