import {
  Adresse,
  type DispositifProgrammesNationaux,
  type FormationsLabels,
  type FraisACharge,
  type Itinerances,
  type LieuMediationNumerique,
  type Pivot,
  type Localisation,
  type ModalitesAcces,
  type ModalitesAccompagnement,
  type PrisesEnChargeSpecifiques,
  type PublicsSpecifiquementAdresses,
  type Services,
  type Typologies,
  type Nom,
  type FicheAccesLibre,
  Horaires,
  type Url
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { type core, ZodError } from 'zod';
import type { EtablissementALAdresse } from '../../../libraries/annuaire-entreprises';
import type { Feature } from '../../../libraries/ban';
import type { AddressCache, AddressRecord } from './address-cache';
import { GeocodingError } from './geocoding';
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
  etablissementRetenu,
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
import type { AccesLibreIndex, AnnuaireIndex } from './fields';
import type { DataSource, LieuxMediationNumeriqueMatching } from './matching';
import type { FindCommune } from '../../../libraries/collectivites';
import { isWorthCaching, type LocationEnriched } from './geocoding';
import type { TransformationRepository } from './transformation-repository';

const isFilled = <T>(nullable?: T[]): nullable is T[] => nullable != null && nullable.length > 0;

const localisationIfAny = (localisation?: Localisation): { localisation?: Localisation } =>
  localisation == null ? {} : { localisation };

const itinerancesIfAny = (itinerance?: Itinerances): { itinerance?: Itinerances } =>
  isFilled(itinerance) ? { itinerance } : {};

const servicesIfAny = (services?: Services): { services?: Services } => (isFilled(services) ? { services } : {});

const fraisAChargeIfAny = (fraisACharge?: FraisACharge): { frais_a_charge?: FraisACharge } =>
  isFilled(fraisACharge) ? { frais_a_charge: fraisACharge } : {};

const ficheAccesLibreIfAny = (ficheAccesLibre?: FicheAccesLibre): { fiche_acces_libre?: FicheAccesLibre } =>
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

const pivotIfAny = (pivot?: Pivot): { pivot?: Pivot } => (pivot == null ? {} : { pivot });

const horairesIfAny = (horaires: string | undefined, recorder: Recorder, entryName: string): { horaires?: Horaires } => {
  if (horaires == null || horaires === '') return {};

  const horairesValides: Horaires | null = Horaires.safe(horaires);

  if (horairesValides != null) return { horaires: horairesValides };

  recorder.record('horaires', `Les horaires ne suivent pas le format OpenStreetMap : « ${horaires} »`, entryName);

  return {};
};

const priseRdvIfAny = (priseRdv?: Url): { prise_rdv?: Url } => (priseRdv == null ? {} : { prise_rdv: priseRdv });

const adresseRetenue = (
  findCommune: FindCommune,
  dataSource: DataSource,
  matching: LieuxMediationNumeriqueMatching,
  locationEnriched?: LocationEnriched
): Adresse =>
  (locationEnriched?.adresse == null ? null : Adresse.safe(locationEnriched.adresse)) ??
  processAdresse(findCommune)(dataSource, matching);

const lieuDeMediationNumerique = async (
  dataSource: DataSource,
  sourceBrute: DataSource,
  sourceName: string,
  recorder: Recorder,
  { findCommune, isInQpv, isInFrr, geocode, config: matching }: TransformationRepository,
  locationEnriched?: LocationEnriched,
  accesLibre: AccesLibreIndex = new Map(),
  annuaire: AnnuaireIndex = new Map()
): Promise<LieuMediationNumerique | undefined> => {
  const adresse: Adresse = adresseRetenue(findCommune, dataSource, matching, locationEnriched);
  const nom: Nom = processNom(dataSource, matching);
  const etablissement: EtablissementALAdresse | undefined = etablissementRetenu(annuaire, adresse, nom);
  const typologies: Typologies = processTypologies(dataSource, matching, etablissement?.natureJuridique);
  const localisation: Localisation | undefined = await processLocalisation(dataSource, matching, geocode(adresse));
  if (isPrive(dataSource, matching)) return undefined;

  const lieuMediationNumerique: LieuMediationNumerique = {
    id: processId(sourceBrute, matching, sourceName),
    ...pivotIfAny(
      processPivot(dataSource, matching, annuaire, etablissement, recorder, entryIdentification(dataSource, matching))
    ),
    nom,
    adresse,
    ...localisationIfAny(localisation),
    ...typologiesIfAny(typologies),
    contact: processContact(recorder)(dataSource, matching),
    ...horairesIfAny(processHoraires(dataSource, matching), recorder, entryIdentification(dataSource, matching)),
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
    ...ficheAccesLibreIfAny(processFicheAccesLibre(dataSource, matching, accesLibre, adresse, nom, typologies)),
    ...priseRdvIfAny(processPriseRdv(dataSource, matching))
  };

  if (lieuMediationNumerique.services == null || lieuMediationNumerique.services.length === 0) {
    recorder
      .record('services', 'Un lieu doit annoncer au moins un service', entryIdentification(dataSource, matching))
      .commit();

    return undefined;
  }

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

const champFautif = (probleme: core.$ZodIssue): string => (probleme.path.length === 0 ? 'lieu' : probleme.path.join('.'));

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
    locationEnriched: LocationEnriched,
    accesLibre: AccesLibreIndex = new Map(),
    annuaire: AnnuaireIndex = new Map()
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
        dataSourceEnriched as DataSource,
        dataSource as DataSource,
        sourceName,
        report.entry(index),
        repository,
        locationEnriched,
        accesLibre,
        annuaire
      );

      // Un lieu absent l'est pour une raison déjà consignée — un nom, une voie, un identifiant
      // invalides. Le rapporter ici une seconde fois lui prêterait un motif qui n'est pas le sien.
      if (lieu == null) return undefined;

      if (isLocated(lieu)) return lieu;

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
      if (error instanceof ZodError) {
        const identification: string = entryIdentification(dataSource as DataSource, repository.config);

        error.issues
          .reduce(
            (recorder: Recorder, probleme: core.$ZodIssue): Recorder =>
              recorder.record(champFautif(probleme), probleme.message, identification),
            report.entry(index)
          )
          .commit();

        return undefined;
      }
      if (error instanceof GeocodingError) {
        return logAndSkip(error);
      }

      throw error;
    }
  };
