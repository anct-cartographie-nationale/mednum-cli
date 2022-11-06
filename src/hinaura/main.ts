/* eslint-disable @typescript-eslint/naming-convention, camelcase, @typescript-eslint/no-restricted-imports, no-undef */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */

import * as fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;
import { HinauraLieuMediationNumerique } from './helper';
import {
  processServices,
  processModalitesAccompagnement,
  processPublicAccueilli,
  processConditionsAccess,
  processContact,
  processAdresse,
  processDate,
  processHoraires,
  processLocalisation
} from './fields';
import {
  LieuMediationNumerique,
  Pivot,
  ServicesError,
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
): LieuMediationNumerique => {
  const lieuMediationNumerique: LieuMediationNumerique = {
    id: index.toString(),
    nom: hinauraLieuMediationNumerique['Nom du lieu ou de la structure *'],
    pivot: Pivot('00000000000000'),
    adresse: processAdresse(recorder)(hinauraLieuMediationNumerique),
    localisation: processLocalisation(hinauraLieuMediationNumerique),
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

  // we print formated data in a json but we also can use directly formatedData here
  const schemaLieuxDeMediationNumeriqueBlob: string = JSON.stringify(
    toSchemaLieuxDeMediationNumerique(lieuxDeMediationNumerique)
  );

  fs.writeFile('./assets/output/hinaura-formated.json', schemaLieuxDeMediationNumeriqueBlob, (): void => undefined);

  // report.records().forEach((record) => {
  //   console.log(record.index);
  //   record.errors.forEach((reportError) => {
  //     console.log(reportError);
  //   });
  // });

  return undefined;
});
