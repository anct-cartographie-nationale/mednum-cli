/* eslint-disable @typescript-eslint/naming-convention, camelcase, max-lines-per-function */

import { LieuMediationNumerique, Pivot, ServicesError, VoieError } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Recorder, Report } from '../report';
import {
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
  processServices
} from '../fields';
import { LieuxMediationNumeriqueMatching, DataSource } from './lieux-mediation-numerique-matching';

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
    publics_accueillis: processPublicAccueilli(dataSource, matching),
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
      throw error;
    }
  };
