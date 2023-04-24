/* eslint-disable @typescript-eslint/naming-convention, camelcase, max-lines-per-function */

import {
  CodePostalError,
  CommuneError,
  ConditionsAcces,
  LabelsNationaux,
  LieuMediationNumerique,
  Localisation,
  ModalitesAccompagnement,
  PublicsAccueillis,
  ServicesError,
  Url,
  VoieError
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Recorder, Report } from '../report';
import {
  processAdresse,
  processConditionsAcces,
  processContact,
  processDate,
  processHoraires,
  processId,
  processLabelsAutres,
  processLabelsNationaux,
  processLocalisation,
  processModalitesAccompagnement,
  processNom,
  processPivot,
  processPresentation,
  processPriseRdv,
  processPublicsAccueillis,
  processServices,
  processSource
} from '../fields';
import { DataSource, LieuxMediationNumeriqueMatching } from './lieux-mediation-numerique-matching';

const horairesIfAny = (horaires?: string): { horaires?: string } => (horaires == null ? {} : { horaires });

const priseRdvIfAny = (priseRdv?: Url): { prise_rdv?: Url } => (priseRdv == null ? {} : { prise_rdv: priseRdv });

const labelsAutresIfAny = (labelsAutres: string[]): { labels_autres?: string[] } =>
  labelsAutres.length === 0 ? {} : { labels_autres: labelsAutres };

const labelsNationauxIfAny = (labelsNationaux: LabelsNationaux): { labels_nationaux?: LabelsNationaux } =>
  labelsNationaux.length === 0 ? {} : { labels_nationaux: labelsNationaux };

const publicsAccueillisIfAny = (publicsAccueillis: PublicsAccueillis): { publics_accueillis?: PublicsAccueillis } =>
  publicsAccueillis.length === 0 ? {} : { publics_accueillis: publicsAccueillis };

const conditionsAccesIfAny = (conditionsAcces: ConditionsAcces): { conditions_acces?: ConditionsAcces } =>
  conditionsAcces.length === 0 ? {} : { conditions_acces: conditionsAcces };

const modalitesAccompagnementIfAny = (
  modaliteAccompagnement: ModalitesAccompagnement
): { modalites_accompagnement?: ModalitesAccompagnement } =>
  modaliteAccompagnement.length === 0 ? {} : { modalites_accompagnement: modaliteAccompagnement };

const localisationIfAny = (localisation?: Localisation): { localisation?: Localisation } =>
  localisation == null ? {} : { localisation };

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
    ...localisationIfAny(processLocalisation(dataSource, matching)),
    contact: processContact(recorder)(dataSource, matching),
    ...conditionsAccesIfAny(processConditionsAcces(dataSource, matching)),
    ...modalitesAccompagnementIfAny(processModalitesAccompagnement(dataSource, matching)),
    date_maj: processDate(dataSource, matching),
    ...labelsNationauxIfAny(processLabelsNationaux(dataSource, matching)),
    ...labelsAutresIfAny(processLabelsAutres(dataSource, matching)),
    ...publicsAccueillisIfAny(processPublicsAccueillis(dataSource, matching)),
    presentation: processPresentation(dataSource, matching),
    services: processServices(dataSource, matching),
    source: processSource(dataSource, matching, sourceName),
    ...horairesIfAny(processHoraires(dataSource, matching)),
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
      if (
        error instanceof ServicesError ||
        error instanceof VoieError ||
        error instanceof CommuneError ||
        error instanceof CodePostalError
      ) {
        report
          .entry(index)
          .record(error.key, error.message, dataSource[JSON.parse(matching).nom.colonne] ?? '')
          .commit();
        return undefined;
      }
      throw error;
    }
  };
