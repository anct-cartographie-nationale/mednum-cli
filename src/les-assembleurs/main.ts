/* eslint-disable no-console,@typescript-eslint/no-restricted-imports,@typescript-eslint/non-nullable-type-assertion-style,no-undef,max-lines-per-function,max-statements,camelcase,complexity,@typescript-eslint/naming-convention,id-denylist,@typescript-eslint/no-explicit-any,no-param-reassign,@typescript-eslint/no-dynamic-delete */

import * as fs from 'fs';
import { LesAssembleursLieuMediationNumerique } from './helpers';
import ErrnoException = NodeJS.ErrnoException;
import { Recorder, Report, writeOutputFiles } from '../tools';
import {
  processAdresse,
  formatServicesField,
  formatPublicAccueilliField,
  formatConditionsAccesField,
  formatModalitesAccompagnementField,
  processContact,
  processHoraires
} from './fields';
import {
  ConditionsAcces,
  Id,
  LieuMediationNumerique,
  Localisation,
  ModalitesAccompagnement,
  Nom,
  Pivot,
  PublicsAccueillis,
  Services,
  ServicesError
} from '@gouvfr-anct/lieux-de-mediation-numerique';

const SOURCE_PATH: string = './assets/input/';
const LES_ASSEMBLEURS_FILE: string = 'les-assembleurs.json';
const report: Report = Report();

const toLieuDeMediationNumerique = (
  lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique,
  recorder: Recorder
): LieuMediationNumerique => {
  const lieuMediationNumerique: LieuMediationNumerique = {
    id: Id(lesAssembleursLieuMediationNumerique.ID),
    nom: Nom(lesAssembleursLieuMediationNumerique.Nom),
    pivot: Pivot('00000000000000'),
    adresse: processAdresse(recorder)(lesAssembleursLieuMediationNumerique),
    localisation: Localisation({
      latitude: parseInt(lesAssembleursLieuMediationNumerique.Latitude, 10),
      longitude: parseInt(lesAssembleursLieuMediationNumerique.Longitude, 10)
    }),
    contact: processContact(recorder)(lesAssembleursLieuMediationNumerique),
    conditions_acces: ConditionsAcces(formatConditionsAccesField(lesAssembleursLieuMediationNumerique)),
    modalites_accompagnement: ModalitesAccompagnement(formatModalitesAccompagnementField(lesAssembleursLieuMediationNumerique)),
    date_maj: new Date(
      `${lesAssembleursLieuMediationNumerique['Date MAJ'].split('/')[2]?.split(' ')[0]}-${
        lesAssembleursLieuMediationNumerique['Date MAJ'].split('/')[1]
      }-${lesAssembleursLieuMediationNumerique['Date MAJ'].split('/')[0]}`
    ),
    publics_accueillis: PublicsAccueillis(formatPublicAccueilliField(lesAssembleursLieuMediationNumerique)),
    services: formatServicesField(
      lesAssembleursLieuMediationNumerique,
      formatModalitesAccompagnementField(lesAssembleursLieuMediationNumerique)
    ) as Services,
    source: 'Les Assembleurs',
    horaires: processHoraires(recorder)(lesAssembleursLieuMediationNumerique) as string
  };
  recorder.commit();
  return lieuMediationNumerique;
};
const validValuesOnly = (lieuDeMediationNumerique?: LieuMediationNumerique): boolean => lieuDeMediationNumerique != null;

const ID: string = 'les-assembleurs'; // todo: remplacer par le SIREN
const NAME: string = 'les-assembleurs';
const TERRITOIRE: string = 'hauts-de-france';

fs.readFile(`${SOURCE_PATH}${LES_ASSEMBLEURS_FILE}`, 'utf8', (_: ErrnoException | null, dataString: string): void => {
  const lieuxDeMediationNumerique: LieuMediationNumerique[] = JSON.parse(dataString)
    .map((lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique): LieuMediationNumerique | undefined => {
      try {
        return toLieuDeMediationNumerique(
          lesAssembleursLieuMediationNumerique,
          report.entry(parseInt(lesAssembleursLieuMediationNumerique.ID, 10))
        );
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

  return undefined;
});
