/* eslint-disable no-console,@typescript-eslint/no-restricted-imports,no-undef,max-lines-per-function,max-statements,camelcase,complexity,@typescript-eslint/naming-convention,id-denylist,@typescript-eslint/no-explicit-any,no-param-reassign,@typescript-eslint/no-dynamic-delete,max-depth,prefer-named-capture-group */

import * as fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;
import { HinauraLieuMediationNumerique } from './helper';
import {
  formatServicesField,
  processModalitesAccompagnement,
  formatPublicAccueilliField,
  processConditionsAccess
} from './fields';
import {
  Adresse,
  ConditionsAccess,
  LieuMediationNumerique,
  Localisation,
  ModalitesAccompagnement,
  Pivot,
  PublicsAccueillis,
  Services,
  toSchemaLieuxDeMediationNumerique
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { processContact } from './fields/contact/contact.field';
import { Recorder, Report } from '../tools';

const SOURCE_PATH: string = './assets/input/';
const HINAURA_FILE: string = 'hinaura.json';

fs.readFile(`${SOURCE_PATH}${HINAURA_FILE}`, 'utf8', (readError: ErrnoException | null, dataString: string): void => {
  if (readError != null) {
    console.error(readError);
    return undefined;
  }

  const hinauraLieuxMediationNumerique: HinauraLieuMediationNumerique[] = JSON.parse(dataString);
  const lieuxDeMediationNumerique: LieuMediationNumerique[] = [];

  const report: Report = Report();

  hinauraLieuxMediationNumerique.forEach(
    (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique, index: number): void => {
      const recorder: Recorder = report.entry(index);

      lieuxDeMediationNumerique.push({
        id: index.toString(),
        nom: hinauraLieuMediationNumerique['Nom du lieu ou de la structure *'],
        pivot: Pivot('00000000000000'),
        adresse: {
          code_postal: hinauraLieuMediationNumerique['Code postal'],
          commune: hinauraLieuMediationNumerique['Ville *'],
          voie: String(hinauraLieuMediationNumerique['Adresse postale *']).includes('\n')
            ? hinauraLieuMediationNumerique['Adresse postale *'].substring(
                0,
                hinauraLieuMediationNumerique['Adresse postale *'].indexOf('\n')
              )
            : hinauraLieuMediationNumerique['Adresse postale *']
        } as unknown as Adresse,
        localisation: Localisation({
          latitude: hinauraLieuMediationNumerique.bf_latitude,
          longitude: hinauraLieuMediationNumerique.bf_longitude
        }),
        contact: processContact(recorder)(hinauraLieuMediationNumerique),
        conditions_access: processConditionsAccess(hinauraLieuMediationNumerique.Tarifs).split(
          ','
        ) as unknown as ConditionsAccess,
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
    }
  );

  // console.log(report.records());

  // we print formated data in a json but we also can use directly formatedData here
  const schemaLieuxDeMediationNumeriqueBlob: string = JSON.stringify(
    toSchemaLieuxDeMediationNumerique(
      lieuxDeMediationNumerique.filter(
        (lieuDeMediationNumerique: LieuMediationNumerique): boolean => lieuDeMediationNumerique.services.length > 0
      )
    )
  );
  fs.writeFile(
    './assets/output/hinaura-formated.json',
    schemaLieuxDeMediationNumeriqueBlob,
    'utf8',
    (err: ErrnoException | null): void => {
      if (err != null) {
        console.log(err);
        return;
      }
    }
  );

  return undefined;
});
