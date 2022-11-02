/* eslint-disable @typescript-eslint/naming-convention, camelcase, @typescript-eslint/no-restricted-imports, no-undef */
/* eslint-disable max-lines-per-function */

import * as fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;
import { HinauraLieuMediationNumerique } from './helper';
import {
  formatServicesField,
  processModalitesAccompagnement,
  formatPublicAccueilliField,
  processConditionsAccess,
  processContact,
  processAdresse
} from './fields';
import {
  ConditionsAccess,
  LieuMediationNumerique,
  Localisation,
  ModalitesAccompagnement,
  Pivot,
  PublicsAccueillis,
  Services,
  toSchemaLieuxDeMediationNumerique
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Recorder, Report } from '../tools';

const SOURCE_PATH: string = './assets/input/';
const HINAURA_FILE: string = 'hinaura.json';
const report: Report = Report();

const toLieuDeMediationNumerique = (
  index: number,
  hinauraLieuMediationNumerique: HinauraLieuMediationNumerique,
  recorder: Recorder
): LieuMediationNumerique => ({
  id: index.toString(),
  nom: hinauraLieuMediationNumerique['Nom du lieu ou de la structure *'],
  pivot: Pivot('00000000000000'),
  // todo: add recorder
  adresse: processAdresse(recorder)(hinauraLieuMediationNumerique),
  localisation: Localisation({
    latitude: hinauraLieuMediationNumerique.bf_latitude,
    longitude: hinauraLieuMediationNumerique.bf_longitude
  }),
  // todo: set phones to international format
  contact: processContact(recorder)(hinauraLieuMediationNumerique),
  conditions_access: processConditionsAccess(hinauraLieuMediationNumerique.Tarifs).split(',') as unknown as ConditionsAccess,
  modalites_accompagnement: processModalitesAccompagnement(
    hinauraLieuMediationNumerique["Types d'accompagnement proposés"]
  ).split(',') as unknown as ModalitesAccompagnement,
  date_maj: new Date(
    `${hinauraLieuMediationNumerique.datetime_latest.split('/')[2]?.split(' ')[0]}-${
      hinauraLieuMediationNumerique.datetime_latest.split('/')[1]
    }-${hinauraLieuMediationNumerique.datetime_latest.split('/')[0]}`
  ),
  publics_accueillis: PublicsAccueillis(formatPublicAccueilliField(hinauraLieuMediationNumerique)),
  services: formatServicesField(
    hinauraLieuMediationNumerique,
    processModalitesAccompagnement(hinauraLieuMediationNumerique["Types d'accompagnement proposés"])
  ) as Services,
  source: 'Hinaura'
});

fs.readFile(`${SOURCE_PATH}${HINAURA_FILE}`, 'utf8', (_: ErrnoException | null, dataString: string): void => {
  const lieuxDeMediationNumerique: LieuMediationNumerique[] = JSON.parse(dataString)
    .map(
      (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique, index: number): LieuMediationNumerique =>
        toLieuDeMediationNumerique(index, hinauraLieuMediationNumerique, report.entry(index))
    )
    .filter((lieuDeMediationNumerique: LieuMediationNumerique): boolean => lieuDeMediationNumerique.services.length > 0);

  // console.log(report.records());

  // we print formated data in a json but we also can use directly formatedData here
  const schemaLieuxDeMediationNumeriqueBlob: string = JSON.stringify(
    toSchemaLieuxDeMediationNumerique(lieuxDeMediationNumerique)
  );

  fs.writeFile('./assets/output/hinaura-formated.json', schemaLieuxDeMediationNumeriqueBlob, (): void => undefined);

  return undefined;
});
