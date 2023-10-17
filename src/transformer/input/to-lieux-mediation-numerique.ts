/* eslint-disable @typescript-eslint/naming-convention, camelcase, max-lines-per-function, max-lines */

import {
  Adresse,
  CodePostalError,
  CommuneError,
  ConditionsAcces,
  IdError,
  LabelsNationaux,
  LieuMediationNumerique,
  Localisation,
  ModalitesAccompagnement,
  NomError,
  PublicsAccueillis,
  ServicesError,
  Typologies,
  Url,
  VoieError
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Recorder, Report } from '../report';
import {
  Erp,
  FindCommune,
  IsInQpv,
  IsInZrr,
  processAccessibilite,
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
  processSource,
  processTypologies
} from '../fields';
import { TransformationRepository } from '../repositories';
import { DataSource, LieuxMediationNumeriqueMatching } from './lieux-mediation-numerique-matching';
import { processPrive } from '../fields/prive/prive.field';

const localisationIfAny = (localisation?: Localisation): { localisation?: Localisation } =>
  localisation == null ? {} : { localisation };

const conditionsAccesIfAny = (conditionsAcces: ConditionsAcces): { conditions_acces?: ConditionsAcces } =>
  conditionsAcces.length === 0 ? {} : { conditions_acces: conditionsAcces };

const accessibiliteIfAny = (accessibilite?: Url): { accessibilite?: Url } => (accessibilite == null ? {} : { accessibilite });

const modalitesAccompagnementIfAny = (
  modaliteAccompagnement: ModalitesAccompagnement
): { modalites_accompagnement?: ModalitesAccompagnement } =>
  modaliteAccompagnement.length === 0 ? {} : { modalites_accompagnement: modaliteAccompagnement };

const typologiesIfAny = (typologies: Typologies): { typologies?: Typologies } =>
  typologies.length === 0 ? {} : { typologies };

const labelsNationauxIfAny = (labelsNationaux: LabelsNationaux): { labels_nationaux?: LabelsNationaux } =>
  labelsNationaux.length === 0 ? {} : { labels_nationaux: labelsNationaux };

const labelsAutresIfAny = (labelsAutres: string[]): { labels_autres?: string[] } =>
  labelsAutres.length === 0 ? {} : { labels_autres: labelsAutres };

const publicsAccueillisIfAny = (publicsAccueillis: PublicsAccueillis): { publics_accueillis?: PublicsAccueillis } =>
  publicsAccueillis.length === 0 ? {} : { publics_accueillis: publicsAccueillis };

const horairesIfAny = (horaires?: string): { horaires?: string } => (horaires == null ? {} : { horaires });

const priseRdvIfAny = (priseRdv?: Url): { prise_rdv?: Url } => (priseRdv == null ? {} : { prise_rdv: priseRdv });

const lieuDeMediationNumerique = (
  index: number,
  dataSource: DataSource,
  sourceName: string,
  matching: LieuxMediationNumeriqueMatching,
  recorder: Recorder,
  accesLibreData: Erp[],
  findCommune: FindCommune,
  isInQpv: IsInQpv,
  isInZrr: IsInZrr
): LieuMediationNumerique | undefined => {
  const adresse: Adresse = processAdresse(findCommune)(dataSource, matching);
  const localistaion: Localisation = processLocalisation(dataSource, matching);
  const noPublicConum: boolean = processPrive(dataSource, matching);

  if (noPublicConum) return undefined;

  const lieuMediationNumerique: LieuMediationNumerique = {
    id: processId(dataSource, matching, index),
    nom: processNom(dataSource, matching),
    pivot: processPivot(dataSource, matching),
    adresse,
    ...localisationIfAny(localistaion),
    contact: processContact(recorder)(dataSource, matching),
    ...conditionsAccesIfAny(processConditionsAcces(dataSource, matching)),
    ...modalitesAccompagnementIfAny(processModalitesAccompagnement(dataSource, matching)),
    date_maj: processDate(dataSource, matching),
    ...labelsNationauxIfAny(processLabelsNationaux(dataSource, matching)),
    ...labelsAutresIfAny(processLabelsAutres(dataSource, matching, isInQpv, isInZrr, adresse, localistaion)),
    ...publicsAccueillisIfAny(processPublicsAccueillis(dataSource, matching)),
    presentation: processPresentation(dataSource, matching),
    services: processServices(dataSource, matching),
    source: processSource(dataSource, matching, sourceName),
    ...horairesIfAny(processHoraires(dataSource, matching)),
    ...priseRdvIfAny(processPriseRdv(dataSource, matching)),
    ...typologiesIfAny(processTypologies(dataSource, matching)),
    ...accessibiliteIfAny(processAccessibilite(dataSource, matching, accesLibreData, adresse))
  };

  recorder.commit();
  return lieuMediationNumerique;
};

export const validValuesOnly = (
  lieuDeMediationNumeriqueToValidate?: LieuMediationNumerique
): lieuDeMediationNumeriqueToValidate is LieuMediationNumerique => lieuDeMediationNumeriqueToValidate != null;

const entryIdentification = (dataSource: DataSource, matching: LieuxMediationNumeriqueMatching): string =>
  dataSource[matching.nom.colonne]?.toString() ?? '';

export const toLieuxMediationNumerique =
  (lieuxDeMediationNumeriqueTransformationRepository: TransformationRepository, sourceName: string, report: Report) =>
  (dataSource: unknown, index: number): LieuMediationNumerique | undefined => {
    try {
      return lieuDeMediationNumerique(
        index,
        dataSource as DataSource,
        sourceName,
        lieuxDeMediationNumeriqueTransformationRepository.config,
        report.entry(index),
        lieuxDeMediationNumeriqueTransformationRepository.accesLibre,
        lieuxDeMediationNumeriqueTransformationRepository.findCommune,
        lieuxDeMediationNumeriqueTransformationRepository.isInQpv,
        lieuxDeMediationNumeriqueTransformationRepository.isInZrr
      );
    } catch (error: unknown) {
      if (
        error instanceof IdError ||
        error instanceof ServicesError ||
        error instanceof VoieError ||
        error instanceof CommuneError ||
        error instanceof CodePostalError ||
        error instanceof NomError
      ) {
        report
          .entry(index)
          .record(
            error.key,
            error.message,
            entryIdentification(dataSource as DataSource, lieuxDeMediationNumeriqueTransformationRepository.config)
          )
          .commit();
        return undefined;
      }
      throw error;
    }
  };
