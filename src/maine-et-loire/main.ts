/* eslint-disable @typescript-eslint/naming-convention, camelcase, @typescript-eslint/no-restricted-imports, no-undef */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */

import * as fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;
import {
  LieuMediationNumerique,
  ModaliteAccompagnement,
  ModalitesAccompagnement,
  Pivot,
  Services,
  ServicesError
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { appendModaliteAccompagnementMatchingKeywords, processServices, Recorder, Report, writeOutputFiles } from '../tools';
import {
  formatServicesField,
  // processServices,
  // processModalitesAccompagnement,
  // processPublicAccueilli,
  // processConditionsAccess,
  // processContact,
  processAdresse,
  processContact,
  processLocalisation,
  processModalitesAccompagnement
  // processDate,
  // processHoraires,
} from './fields';
import { MaineEtLoireLieuMediationNumerique } from './helper';

const SOURCE_PATH: string = './assets/input/';
const MAINE_ET_LOIRE_FILE: string = 'lieux-de-mediation-numerique-en-maine-et-loire.json';
const report: Report = Report();

const toLieuDeMediationNumerique = (
  maineEtLoireLieuMediationNumerique: MaineEtLoireLieuMediationNumerique,
  recorder: Recorder
): LieuMediationNumerique => {
  const lieuMediationNumerique: LieuMediationNumerique = {
    id: maineEtLoireLieuMediationNumerique.ID,
    nom: maineEtLoireLieuMediationNumerique.Nom,
    pivot: Pivot('00000000000000'),
    adresse: processAdresse(recorder)(maineEtLoireLieuMediationNumerique),
    localisation: processLocalisation(
      maineEtLoireLieuMediationNumerique['Geo Point'].split(',')[0],
      maineEtLoireLieuMediationNumerique['Geo Point'].split(',')[1]
    ),
    contact: processContact(recorder)(maineEtLoireLieuMediationNumerique),
    // conditions_access: processConditionsAccess(hinauraLieuMediationNumerique),
    modalites_accompagnement: ModalitesAccompagnement(
      processModalitesAccompagnement(maineEtLoireLieuMediationNumerique.JT_Accueil)
    ),
    date_maj: new Date(maineEtLoireLieuMediationNumerique.Date_maj),
    // publics_accueillis: processPublicAccueilli(hinauraLieuMediationNumerique),
    services: formatServicesField(
      maineEtLoireLieuMediationNumerique,
      ModalitesAccompagnement(processModalitesAccompagnement(maineEtLoireLieuMediationNumerique.JT_Accueil))
    ) as Services,
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
