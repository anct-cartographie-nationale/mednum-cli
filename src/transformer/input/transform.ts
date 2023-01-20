/* eslint-disable @typescript-eslint/naming-convention, camelcase, max-lines-per-function */

import {
  CommuneError,
  LieuMediationNumerique,
  ModalitesAccompagnement,
  PublicsAccueillis,
  ServicesError,
  Url,
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
  processPivot,
  processPriseRdv,
  processPublicsAccueillis,
  processServices
} from '../fields';
import { DataSource, LieuxMediationNumeriqueMatching } from './lieux-mediation-numerique-matching';

const horairesIfAny = (horaires?: string): { horaires?: string } => (horaires == null ? {} : { horaires });

const priseRdvIfAny = (priseRdv?: Url): { prise_rdv?: Url } => (priseRdv == null ? {} : { prise_rdv: priseRdv });

const publicsAccueillisIfAny = (publicsAccueillis: PublicsAccueillis): { publics_accueillis?: PublicsAccueillis } =>
  publicsAccueillis.length === 0 ? {} : { publics_accueillis: publicsAccueillis };

const modalitesAccompagnementIfAny = (
  modaliteAccompagnement: ModalitesAccompagnement
): { modalites_accompagnement?: ModalitesAccompagnement } =>
  modaliteAccompagnement.length === 0 ? {} : { modalites_accompagnement: modaliteAccompagnement };

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
    pivot: processPivot(dataSource, matching),
    adresse: processAdresse(recorder)(dataSource, matching),
    localisation: processLocalisation(dataSource, matching),
    contact: processContact(recorder)(dataSource, matching),
    conditions_acces: processConditionsAcces(dataSource, matching),
    ...modalitesAccompagnementIfAny(processModalitesAccompagnement(dataSource, matching)),
    date_maj: processDate(dataSource, matching),
    labels_nationaux: processLabelsNationaux(dataSource, matching),
    ...publicsAccueillisIfAny(processPublicsAccueillis(dataSource, matching)),
    services: processServices(dataSource, matching),
    source: sourceName,
    ...horairesIfAny(processHoraires(recorder)(dataSource, matching)),
    ...priseRdvIfAny(processPriseRdv(dataSource, matching))
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
