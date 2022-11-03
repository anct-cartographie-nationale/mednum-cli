/* eslint-disable @typescript-eslint/naming-convention, camelcase, @typescript-eslint/no-restricted-imports, no-undef */

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
  processDate
} from './fields';
import {
  LieuMediationNumerique,
  Localisation,
  Pivot,
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
  adresse: processAdresse(recorder)(hinauraLieuMediationNumerique),
  localisation: Localisation({
    latitude: hinauraLieuMediationNumerique.bf_latitude,
    longitude: hinauraLieuMediationNumerique.bf_longitude
  }),
  contact: processContact(recorder)(hinauraLieuMediationNumerique),
  conditions_access: processConditionsAccess(hinauraLieuMediationNumerique),
  modalites_accompagnement: processModalitesAccompagnement(hinauraLieuMediationNumerique),
  date_maj: processDate(hinauraLieuMediationNumerique),
  publics_accueillis: processPublicAccueilli(hinauraLieuMediationNumerique),
  services: processServices(hinauraLieuMediationNumerique),
  source: 'Hinaura'
  // todo: add opening hours
});

const validValuesOnly = (lieuDeMediationNumerique?: LieuMediationNumerique): boolean => lieuDeMediationNumerique != null;

fs.readFile(`${SOURCE_PATH}${HINAURA_FILE}`, 'utf8', (_: ErrnoException | null, dataString: string): void => {
  const lieuxDeMediationNumerique: LieuMediationNumerique[] = JSON.parse(dataString)
    .map((hinauraLieuMediationNumerique: HinauraLieuMediationNumerique, index: number): LieuMediationNumerique | undefined => {
      try {
        return toLieuDeMediationNumerique(index, hinauraLieuMediationNumerique, report.entry(index));
      } catch {
        return undefined;
      }
    })
    .filter(validValuesOnly);

  // we print formated data in a json but we also can use directly formatedData here
  const schemaLieuxDeMediationNumeriqueBlob: string = JSON.stringify(
    toSchemaLieuxDeMediationNumerique(lieuxDeMediationNumerique)
  );

  fs.writeFile('./assets/output/hinaura-formated.json', schemaLieuxDeMediationNumeriqueBlob, (): void => undefined);

  return undefined;
});
