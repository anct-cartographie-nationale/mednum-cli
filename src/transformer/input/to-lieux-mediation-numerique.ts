import {
  Adresse,
  CodePostalError,
  CommuneError,
  DispositifProgrammesNationaux,
  FormationsLabels,
  FraisACharge,
  IdError,
  Itinerances,
  LieuMediationNumerique,
  Localisation,
  ModalitesAcces,
  ModalitesAccompagnement,
  ModelError,
  NomError,
  PrisesEnChargeSpecifiques,
  PublicsSpecifiquementAdresses,
  Services,
  ServicesError,
  Typologies,
  Url,
  VoieError
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { AxiosError } from 'axios';
import { Recorder, Report } from '../report';
import {
  processFicheAccesLibre,
  processAdresse,
  processFraisACharge,
  processContact,
  processDate,
  processHoraires,
  processId,
  processAutresFormationsLabels,
  processDispositifProgrammeNationaux,
  processLocalisation,
  processModalitesAccompagnement,
  processNom,
  processPivot,
  processPresentation,
  processPriseRdv,
  processServices,
  processSource,
  processTypologies,
  processItinerances,
  processPublicsSpecifiquementAdresses,
  processPrisesEnChargeSpecifiques,
  processFormationsLabels,
  processModalitesAcces,
  isPrive
} from '../fields';
import { TransformationRepository } from '../repositories';
import { DataSource, LieuxMediationNumeriqueMatching } from './lieux-mediation-numerique-matching';

const isFilled = <T>(nullable?: T[]): nullable is T[] => nullable != null && nullable.length > 0;

const localisationIfAny = (localisation?: Localisation): { localisation?: Localisation } =>
  localisation == null ? {} : { localisation };

const itinerancesIfAny = (itinerance?: Itinerances): { itinerance?: Itinerances } =>
  isFilled(itinerance) ? { itinerance } : {};

const servicesIfAny = (services?: Services): { services?: Services } => (isFilled(services) ? { services } : {});

const fraisAChargeIfAny = (fraisACharge?: FraisACharge): { frais_a_charge?: FraisACharge } =>
  isFilled(fraisACharge) ? { frais_a_charge: fraisACharge } : {};

const ficheAccesLibreIfAny = (ficheAccesLibre?: Url): { fiche_acces_libre?: Url } =>
  ficheAccesLibre == null ? {} : { fiche_acces_libre: ficheAccesLibre };

const modalitesAccompagnementIfAny = (
  modaliteAccompagnement?: ModalitesAccompagnement
): { modalites_accompagnement?: ModalitesAccompagnement } =>
  isFilled(modaliteAccompagnement) ? { modalites_accompagnement: modaliteAccompagnement } : {};

const modalitesAccesIfAny = (modalitesAcces?: ModalitesAcces): { modalites_acces?: ModalitesAcces } =>
  isFilled(modalitesAcces) ? { modalites_acces: modalitesAcces } : {};

const typologiesIfAny = (typologies?: Typologies): { typologies?: Typologies } => (isFilled(typologies) ? { typologies } : {});

const dispositifProgrammesNationauxIfAny = (
  dispositifProgrammesNationaux?: DispositifProgrammesNationaux
): { dispositif_programmes_nationaux?: DispositifProgrammesNationaux } =>
  isFilled(dispositifProgrammesNationaux) ? { dispositif_programmes_nationaux: dispositifProgrammesNationaux } : {};

const formationsLabelsIfAny = (formationsLabels?: FormationsLabels): { formations_labels?: FormationsLabels } =>
  isFilled(formationsLabels) ? { formations_labels: formationsLabels } : {};

const autresFormationsLabelsIfAny = (autresFormationsLabels?: string[]): { autres_formations_labels?: string[] } =>
  isFilled(autresFormationsLabels) ? { autres_formations_labels: autresFormationsLabels } : {};

const publicsSpecifiquementAdressesIfAny = (
  publicsSpecifiquementAdresses?: PublicsSpecifiquementAdresses
): { publics_specifiquement_adresses?: PublicsSpecifiquementAdresses } =>
  isFilled(publicsSpecifiquementAdresses) ? { publics_specifiquement_adresses: publicsSpecifiquementAdresses } : {};

const prisesEnChargeSpecifiquesIfAny = (
  prisesEnChargeSpecifiques?: PrisesEnChargeSpecifiques
): { prise_en_charge_specifique?: PrisesEnChargeSpecifiques } =>
  isFilled(prisesEnChargeSpecifiques) ? { prise_en_charge_specifique: prisesEnChargeSpecifiques } : {};

const horairesIfAny = (horaires?: string): { horaires?: string } => (horaires == null ? {} : { horaires });

const priseRdvIfAny = (priseRdv?: Url): { prise_rdv?: Url } => (priseRdv == null ? {} : { prise_rdv: priseRdv });

const lieuDeMediationNumerique = async (
  index: number,
  dataSource: DataSource,
  sourceName: string,
  recorder: Recorder,
  { findCommune, isInQpv, isInZrr, geocode, config: matching }: TransformationRepository
): Promise<LieuMediationNumerique | undefined> => {
  const adresse: Adresse = processAdresse(findCommune)(dataSource, matching);
  const localisation: Localisation | undefined = await processLocalisation(dataSource, matching, geocode(adresse));

  if (isPrive(dataSource, matching)) return undefined;

  const lieuMediationNumerique: LieuMediationNumerique = {
    id: processId(dataSource, matching, index, sourceName),
    pivot: processPivot(dataSource, matching),
    nom: processNom(dataSource, matching),
    adresse,
    ...localisationIfAny(localisation),
    ...typologiesIfAny(processTypologies(dataSource, matching)),
    contact: processContact(recorder)(dataSource, matching),
    ...horairesIfAny(processHoraires(dataSource, matching)),
    presentation: processPresentation(dataSource, matching),
    source: processSource(dataSource, matching, sourceName),
    ...itinerancesIfAny(processItinerances(dataSource, matching)),
    date_maj: processDate(dataSource, matching),
    ...servicesIfAny(processServices(dataSource, matching)),
    ...publicsSpecifiquementAdressesIfAny(processPublicsSpecifiquementAdresses(dataSource, matching)),
    ...prisesEnChargeSpecifiquesIfAny(processPrisesEnChargeSpecifiques(dataSource, matching)),
    ...fraisAChargeIfAny(processFraisACharge(dataSource, matching)),
    ...dispositifProgrammesNationauxIfAny(processDispositifProgrammeNationaux(dataSource, matching)),
    ...formationsLabelsIfAny(processFormationsLabels(dataSource, matching)),
    ...autresFormationsLabelsIfAny(
      processAutresFormationsLabels(dataSource, matching, isInQpv, isInZrr, adresse, localisation)
    ),
    ...modalitesAccesIfAny(processModalitesAcces(dataSource, matching)),
    ...modalitesAccompagnementIfAny(processModalitesAccompagnement(dataSource, matching)),
    ...ficheAccesLibreIfAny(processFicheAccesLibre(dataSource, matching, [], adresse)),
    ...priseRdvIfAny(processPriseRdv(dataSource, matching))
  };

  recorder.commit();
  return lieuMediationNumerique;
};

export const validValuesOnly = (
  lieuDeMediationNumeriqueToValidate?: LieuMediationNumerique
): lieuDeMediationNumeriqueToValidate is LieuMediationNumerique => lieuDeMediationNumeriqueToValidate != null;

export const isFlatten = (repository: LieuxMediationNumeriqueMatching): boolean => {
  const regex = /\.\d+\./;
  const keysConfig = Object.keys(repository).map((key) => {
    const value = repository[key];
    if (Array.isArray(value)) {
      return value.flatMap((v) => v.colonnes);
    }
    return value.colonne;
  });

  return keysConfig.flat().find((value) => regex.test(value)) ? false : true;
};

const entryIdentification = (dataSource: DataSource, matching: LieuxMediationNumeriqueMatching): string =>
  dataSource[matching.nom.colonne]?.toString() ?? '';

const isErrorToReport = (error: unknown): error is ModelError<LieuMediationNumerique> =>
  error instanceof IdError ||
  error instanceof ServicesError ||
  error instanceof VoieError ||
  error instanceof CommuneError ||
  error instanceof CodePostalError ||
  error instanceof NomError;

const logAndSkip = (error: AxiosError): LieuMediationNumerique | undefined => {
  console.log(error);
  return undefined;
};

export const toLieuxMediationNumerique =
  (repository: TransformationRepository, sourceName: string, report: Report) =>
  async (dataSource: unknown, index: number): Promise<LieuMediationNumerique | undefined> => {
    try {
      return await lieuDeMediationNumerique(index, dataSource as DataSource, sourceName, report.entry(index), repository);
    } catch (error: unknown) {
      if (isErrorToReport(error)) {
        report
          .entry(index)
          .record(error.key, error.message, entryIdentification(dataSource as DataSource, repository.config))
          .commit();
        return undefined;
      }
      if (error instanceof AxiosError) {
        return logAndSkip(error);
      }

      throw error;
    }
  };
