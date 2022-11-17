/* eslint-disable @typescript-eslint/naming-convention, camelcase, @typescript-eslint/no-restricted-imports, no-undef */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */

import * as fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;
import { LieuMediationNumerique, Pivot, ServicesError } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { processLocalisation, Recorder, Report, writeOutputFiles } from '../tools';
import {
  // processServices,
  // processModalitesAccompagnement,
  // processPublicAccueilli,
  // processConditionsAccess,
  // processContact,
  processAdresse,
  processContact
  // processDate,
  // processHoraires,
  // processLocalisation
} from './fields';
import { MaineEtLoireLieuMediationNumerique } from './helper';

const SOURCE_PATH: string = './assets/input/';
const MAINE_ET_LOIRE_FILE: string = 'lieux-de-mediation-numerique-en-maine-et-loire.json';
const report: Report = Report();

const toLieuDeMediationNumerique = (
  maineEtLoireLieuMediationNumerique: MaineEtLoireLieuMediationNumerique,
  recorder: Recorder
): LieuMediationNumerique => {
  const lieuMediationNumerique: any = {
    id: maineEtLoireLieuMediationNumerique.ID,
    nom: maineEtLoireLieuMediationNumerique.Nom,
    pivot: Pivot('00000000000000'),
    adresse: processAdresse(recorder)(maineEtLoireLieuMediationNumerique),
    localisation: processLocalisation(
      maineEtLoireLieuMediationNumerique['Geo Point'].split(',')[0],
      maineEtLoireLieuMediationNumerique['Geo Point'].split(',')[1]
    ),
    contact: console.log(processContact(recorder)(maineEtLoireLieuMediationNumerique)),
    // conditions_access: processConditionsAccess(hinauraLieuMediationNumerique),
    // modalites_accompagnement: processModalitesAccompagnement(hinauraLieuMediationNumerique),
    // date_maj: processDate(maineEtLoireLieuMediationNumerique),
    // publics_accueillis: processPublicAccueilli(hinauraLieuMediationNumerique),
    // services: processServices(maineEtLoireLieuMediationNumerique),
    source: 'Maine-et-Loire'
    // horaires: processHoraires(recorder)(hinauraLieuMediationNumerique) as string
  };
  recorder.commit();
  return lieuMediationNumerique;
};
const validValuesOnly = (lieuDeMediationNumerique?: LieuMediationNumerique): boolean => lieuDeMediationNumerique != null;

const ID: string = 'maine-et-loire'; // todo: remplacer par le SIREN
const NAME: string = 'maine-et-loire';
const TERRITOIRE: string = 'pays-de-la-loire';

fs.readFile(`${SOURCE_PATH}${MAINE_ET_LOIRE_FILE}`, 'utf8', (_: ErrnoException | null, dataString: string): void => {
  const lieuxDeMediationNumerique: LieuMediationNumerique[] = JSON.parse(dataString)
    .map((maineEtLoireLieuMediationNumerique: MaineEtLoireLieuMediationNumerique): LieuMediationNumerique | undefined => {
      try {
        toLieuDeMediationNumerique(
          maineEtLoireLieuMediationNumerique,
          report.entry(parseInt(maineEtLoireLieuMediationNumerique.ID, 10))
        );
        // return toLieuDeMediationNumerique(
        //   maineEtLoireLieuMediationNumerique,
        //   report.entry(parseInt(maineEtLoireLieuMediationNumerique.ID, 10))
        // );
      } catch (error: unknown) {
        if (error instanceof ServicesError) return undefined;
        throw error;
      }
    })
    .filter(validValuesOnly);

  // writeOutputFiles({
  //   id: ID,
  //   name: NAME,
  //   territoire: TERRITOIRE
  // })(lieuxDeMediationNumerique);

  return undefined;
});
