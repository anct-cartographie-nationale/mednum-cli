/* eslint-disable @typescript-eslint/naming-convention, camelcase, max-lines-per-function */

import {
  CommuneError,
  LieuMediationNumerique,
  Pivot,
  ServicesError,
  VoieError
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Recorder, Report } from '../report';
import {
  DateCannotBeEmptyError,
  processAdresse,
  processConditionsAcces,
  processContact,
  processDate,
  processHoraires,
  processId,
  processLabelsNationaux,
  processLocalisation,
  processModalitesAccompagnement,
  processNom,
  processPublicsAccueillis,
  processServices
} from '../fields';
import { DataSource, LieuxMediationNumeriqueMatching } from './lieux-mediation-numerique-matching';

const lieuDeMediationNumerique = (
  index: number,
  dataSource: DataSource,
  sourceName: string,
  matching: LieuxMediationNumeriqueMatching,
  recorder: Recorder
): LieuMediationNumerique => {
  const lieuMediationNumerique: LieuMediationNumerique = {
    id: processId(dataSource, matching, index),
    nom: processNom(dataSource, matching),
    pivot: Pivot('00000000000000'),
    adresse: processAdresse(recorder)(dataSource, matching),
    localisation: processLocalisation(dataSource, matching),
    contact: processContact(recorder)(dataSource, matching),
    conditions_acces: processConditionsAcces(dataSource, matching),
    modalites_accompagnement: processModalitesAccompagnement(dataSource, matching),
    date_maj: processDate(dataSource, matching),
    labels_nationaux: processLabelsNationaux(matching),
    publics_accueillis: processPublicsAccueillis(dataSource, matching),
    services: processServices(dataSource, matching),
    source: sourceName,
    horaires: processHoraires(recorder)(dataSource, matching)?.toString() ?? ''
  };
  recorder.commit();
  return lieuMediationNumerique;
};

export const validValuesOnly = (lieuDeMediationNumeriqueToValidate?: LieuMediationNumerique): boolean =>
  lieuDeMediationNumeriqueToValidate != null;

export const toLieuxMediationNumerique =
  (matching: string, sourceName: string, report: Report) =>
  (dataSource: DataSource, index: number): LieuMediationNumerique | undefined => {
    try {
      return lieuDeMediationNumerique(index, dataSource, sourceName, JSON.parse(matching), report.entry(index));
    } catch (error: unknown) {
      if (error instanceof ServicesError) return undefined;
      if (error instanceof VoieError) return undefined;
      if (error instanceof CommuneError) return undefined;
      if (error instanceof DateCannotBeEmptyError) return undefined;
      throw error;
    }
  };
