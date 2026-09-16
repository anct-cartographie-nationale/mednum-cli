import {
  type Adresse,
  CodePostalError,
  CommuneError,
  type DispositifProgrammesNationaux,
  type FormationsLabels,
  type FraisACharge,
  IdError,
  type Itinerances,
  type LieuMediationNumerique,
  type Localisation,
  type ModalitesAcces,
  type ModalitesAccompagnement,
  type ModelError,
  NomError,
  type PrisesEnChargeSpecifiques,
  type PublicsSpecifiquementAdresses,
  type Services,
  ServicesError,
  type Typologies,
  type Url,
  UrlError,
  VoieError,
  CourrielError
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { Feature } from '../../../libraries/ban';
import type { AddressCache, AddressRecord } from './address-cache';
import { GeocodingError } from './geocoding.error';
import type { Recorder, Report } from './report';
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
} from './fields';
import type { DataSource, LieuxMediationNumeriqueMatching } from './matching';
import { isWorthCaching, type LocationEnriched } from './location-enriched';
import type { TransformationRepository } from './transformation-repository';

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
  { findCommune, isInQpv, isInFrr, geocode, config: matching }: TransformationRepository
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
      processAutresFormationsLabels(dataSource, matching, isInQpv, isInFrr, adresse, localisation)
    ),
    ...modalitesAccesIfAny(processModalitesAcces(dataSource, matching)),
    ...modalitesAccompagnementIfAny(processModalitesAccompagnement(dataSource, matching)),
    ...ficheAccesLibreIfAny(processFicheAccesLibre(dataSource, matching, [], adresse)),
    ...priseRdvIfAny(processPriseRdv(dataSource, matching))
  };

  recorder.commit();
  return lieuMediationNumerique;
};

/**
 * Le champ sous lequel un lieu écarté faute de coordonnées est porté au rapport. Le retrait
 * d'un lieu ne doit jamais être silencieux : c'est cette ligne qui permet d'en informer le
 * producteur et de lui dire quelle adresse le référentiel n'a pas su reconnaître.
 */
export const UNLOCATED_FIELD = 'localisation';

/**
 * L'adresse et les coordonnées sont les informations les plus déterminantes d'un lieu de
 * médiation numérique : sans elles on ne peut ni s'y rendre, ni le porter sur une carte. Un lieu
 * que le géocodage n'a pas su situer — la Base Adresse Nationale restée sous le seuil, ou la
 * source sans aucune coordonnée — est donc écarté plutôt que publié incomplet.
 */
export const isLocated = (lieu: LieuMediationNumerique): boolean => lieu.localisation != null;

export const validValuesOnly = (
  lieuDeMediationNumeriqueToValidate?: LieuMediationNumerique
): lieuDeMediationNumeriqueToValidate is LieuMediationNumerique => lieuDeMediationNumeriqueToValidate != null;

export const isFlatten = (repository: Record<string, unknown>): boolean => {
  const regex = /\.\d+(\.|$)/;
  const keysConfig = Object.keys(repository).map((key: string) => {
    const value = repository[key];
    if (Array.isArray(value)) {
      return value.flatMap((v) => v.colonnes);
    }
    return (value as { colonne: string }).colonne;
  });

  return !keysConfig.flat().find((value) => regex.test(value));
};

const entryIdentification = (dataSource: DataSource, matching: LieuxMediationNumeriqueMatching): string =>
  dataSource[matching.nom.colonne]?.toString() ?? '';

/**
 * L'étiquette enregistrée est celle qu'a servie `getAddressData` : la recalculer ici ferait
 * dépendre la clé du cache de deux chemins qui pourraient diverger.
 */
const addresseLog = (addresseOriginale: string, addresseBan: Feature): AddressRecord => ({
  dateDeTraitement: new Date(),
  addresseOriginale,
  responseBan: addresseBan
});

const isErrorToReport = (error: unknown): error is ModelError<LieuMediationNumerique> =>
  error instanceof IdError ||
  error instanceof ServicesError ||
  error instanceof VoieError ||
  error instanceof CommuneError ||
  error instanceof CodePostalError ||
  error instanceof NomError ||
  error instanceof UrlError ||
  error instanceof CourrielError;

const logAndSkip = (error: GeocodingError): LieuMediationNumerique | undefined => {
  console.log(error.cause ?? error);
  return undefined;
};

export const toLieuxMediationNumerique =
  (
    repository: TransformationRepository,
    sourceName: string,
    report: Report,
    addressCache: AddressCache,
    locationEnriched: LocationEnriched
  ) =>
  async (dataSource: unknown, index: number): Promise<LieuMediationNumerique | undefined> => {
    try {
      const dataSourceEnriched = {
        ...(dataSource as DataSource),
        ...(locationEnriched?.data && locationEnriched.data)
      } as DataSource;

      if (locationEnriched != null && isWorthCaching(locationEnriched)) {
        addressCache
          .entry(index)
          .record(addresseLog(locationEnriched.addresseOriginale ?? '', locationEnriched.responses?.features?.[0] as Feature))
          .commit();
      }
      const lieu: LieuMediationNumerique | undefined = await lieuDeMediationNumerique(
        index,
        dataSourceEnriched as DataSource,
        sourceName,
        report.entry(index),
        repository
      );

      if (lieu != null && isLocated(lieu)) return lieu;

      report
        .entry(index)
        .record(
          UNLOCATED_FIELD,
          `Adresse non reconnue par la Base Adresse Nationale : « ${locationEnriched?.addresseOriginale ?? ''} » — ${locationEnriched?.motif ?? 'motif inconnu'}`,
          entryIdentification(dataSource as DataSource, repository.config)
        )
        .commit();

      return undefined;
    } catch (error: unknown) {
      if (isErrorToReport(error)) {
        report
          .entry(index)
          .record(error.key, error.message, entryIdentification(dataSource as DataSource, repository.config))
          .commit();
        return undefined;
      }
      if (error instanceof GeocodingError) {
        return logAndSkip(error);
      }

      throw error;
    }
  };
