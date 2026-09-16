import { type Adresse, Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { BanAddressRow, Feature, FeatureCollection } from '../../../libraries/ban';
import { type Coordinates, distanceInMeters } from '../../../libraries/geometry';
import { type AddressRecord, isRecentFailedAttempt } from './address-cache';
import { toCleanField } from './fields/adresse/clean-operations';
import { NO_LOCALISATION, processLocalisation } from './fields/localisation/localisation.field';
import { CLEAN_VOIE_FOR_SEARCH } from './fields/adresse/clean-voie';
import type { DataSource, LieuxMediationNumeriqueMatching } from './matching';

/**
 * L'adresse telle que le dépôt la reconstitue — commune et code postal complétés par le
 * référentiel des communes — mais sans la validation qu'impose `Adresse`. C'est cette forme,
 * et non les colonnes brutes, qui sert de question à la Base Adresse Nationale et de clé au
 * cache : la question posée est ainsi exactement l'adresse qui sera publiée.
 */
export type NormalizedAddress = Omit<Adresse, 'isAdresse'>;

/**
 * Un géocodage n'est retenu qu'au delà de ce score : en deçà, la BAN a rapproché l'adresse
 * d'un voisinage plutôt que d'un point précis.
 */
const MINIMUM_BATCH_SCORE = 0.9;

/**
 * Sous le score minimal, un rapprochement reste recevable si la source porte elle-même des
 * coordonnées et que la Base Adresse Nationale tombe à portée : deux relevés indépendants qui
 * désignent le même endroit valent mieux qu'un score. Le rayon est le neuvième décile des
 * écarts observés sur les réponses dont la voie est certaine — au delà, on enverrait quelqu'un
 * trop loin.
 */
export const CORROBORATION_RADIUS_IN_METERS = 500;

export type BanResponse = { data: FeatureCollection };

/**
 * Une panne du géocodeur n'est pas une absence de résultat. La seconde apprend quelque chose —
 * la BAN ne connaît pas cette adresse — la première n'apprend rien. Les confondre inscrirait au
 * cache, le temps d'une coupure, des milliers d'échecs datés du jour, que la règle de fraîcheur
 * figerait ensuite une semaine.
 */
export const GEOCODING_UNAVAILABLE: 'geocoding_unavailable' = 'geocoding_unavailable';

export type BatchGeocoding = BanResponse | typeof GEOCODING_UNAVAILABLE | null;

export type LocationEnriched = {
  data?: DataSource;
  responses?: FeatureCollection;
  addresseOriginale?: string;
  statut: 'no_from_storage' | 'from_storage' | 'from_api' | 'geocoding_unavailable';
};

/**
 * La voie telle qu'on la soumet au géocodeur. C'est aussi la clé du cache : ce que l'on retient
 * doit être indexé par la question posée, non par une variante jamais demandée.
 */
const searchableVoie = (voie: string): string => CLEAN_VOIE_FOR_SEARCH.reduce(toCleanField, voie);

export const addressLabel = ({ voie, code_postal, commune }: NormalizedAddress): string =>
  `${searchableVoie(voie)} ${code_postal} ${commune}`;

export const isMissingFields = ({ voie, code_postal, commune }: NormalizedAddress): boolean =>
  commune === '' || code_postal === '' || voie === '';

export const banRowFor = (adresse: NormalizedAddress): BanAddressRow => ({
  voie: searchableVoie(adresse.voie),
  codePostal: adresse.code_postal,
  commune: adresse.commune
});

const scoreOf = (feature?: Feature): number => feature?.properties.score ?? 0;

const coordinatesOf = (feature: Feature): Coordinates => ({
  latitude: feature.geometry.coordinates[1] ?? 0,
  longitude: feature.geometry.coordinates[0] ?? 0
});

/**
 * Ce que la source apporte de son côté : ses propres coordonnées, qui permettent de corroborer,
 * et son adresse telle qu'écrite, que le complément recueillera si la réponse n'a été retenue
 * que sur la foi de cette proximité.
 */
export type SourceEvidence = {
  localisation?: Coordinates;
  origine: string;
  complement?: string;
};

const isCorroborated = (feature: Feature, localisation?: Coordinates): boolean =>
  localisation != null && distanceInMeters(localisation, coordinatesOf(feature)) < CORROBORATION_RADIUS_IN_METERS;

export const toLocalisation = (response: BanResponse): Localisation =>
  Localisation({
    latitude: response.data.features[0]?.geometry?.coordinates[1] ?? 0,
    longitude: response.data.features[0]?.geometry?.coordinates[0] ?? 0
  });

const localisationOf = (feature: Feature): Localisation =>
  Localisation({
    latitude: feature.geometry.coordinates[1] ?? 0,
    longitude: feature.geometry.coordinates[0] ?? 0
  });

const geocodedColumns = (matching: LieuxMediationNumeriqueMatching, feature: Feature, complement?: string): DataSource => {
  const { latitude, longitude }: Localisation = localisationOf(feature);

  return {
    ...(complement == null ? {} : { [matching.complement_adresse?.colonne as string]: complement }),
    [matching.adresse.colonne as string]: feature.properties.name,
    [matching.code_postal?.colonne as string]: feature.properties.postcode,
    [matching.code_insee?.colonne as string]: feature.properties.citycode,
    [matching.commune?.colonne as string]: feature.properties.city,
    [matching.latitude?.colonne as string]: latitude,
    [matching.longitude?.colonne as string]: longitude
  };
};

/**
 * Le chargement du cache déduplique déjà, mais cette fonction ne s'y fie pas : si une même
 * adresse revient en échec et en succès, le succès l'emporte, faute de quoi l'ordre du tableau
 * déciderait du sort du lieu.
 */
const cachedFor = (records: AddressRecord[], addressLabel: string): AddressRecord | undefined =>
  records.find((record: AddressRecord): boolean => record?.addresseOriginale === addressLabel && record.responseBan != null) ??
  records.find((record: AddressRecord): boolean => record?.addresseOriginale === addressLabel);

/**
 * Liste blanche volontaire : seule une tentative réellement aboutie — la BAN a répondu, qu'elle
 * ait trouvé ou non — apprend quelque chose au cache. Tout autre statut, en particulier une
 * indisponibilité du géocodeur, doit le laisser intact.
 */
export const isWorthCaching = ({ statut }: LocationEnriched): boolean => statut === 'from_api' || statut === 'no_from_storage';

/**
 * Le rapprochement est retenu s'il se suffit à lui-même — le score dépasse le minimum — ou si la
 * source le corrobore par ses propres coordonnées. Ces deux voies n'ont pas la même conséquence :
 * la seconde verse l'adresse d'origine au complément, pour qu'un lecteur retrouve ce que le
 * producteur avait écrit là où le référentiel n'a pas su le suivre à la lettre.
 */
const acceptedFeature = (evidence: SourceEvidence, response?: BanResponse | null): Feature | undefined => {
  const feature: Feature | undefined = response?.data.features[0];
  if (feature == null) return undefined;

  return scoreOf(feature) > MINIMUM_BATCH_SCORE || isCorroborated(feature, evidence.localisation) ? feature : undefined;
};

const withOrigin = ({ complement, origine }: SourceEvidence): string =>
  complement == null || complement.trim() === '' ? origine : `${complement} - ${origine}`;

const complementFor = (evidence: SourceEvidence, feature: Feature): string | undefined =>
  scoreOf(feature) > MINIMUM_BATCH_SCORE ? undefined : withOrigin(evidence);

/**
 * L'adresse telle que la source l'a écrite, avant tout nettoyage : c'est elle que le complément
 * recueille quand seule la proximité a permis de retenir la réponse.
 */
export const rawAddressLabel = (source: DataSource, matching: LieuxMediationNumeriqueMatching): string =>
  ([matching.adresse.colonne, matching.code_postal.colonne, matching.commune.colonne].flat() as string[])
    .map((colonne: string): string => source[colonne]?.toString() ?? '')
    .filter((value: string): boolean => value !== '')
    .join(' ');

/** Rassemble ce que la source apporte de son côté, sans jamais lever sur une adresse invalide. */
export const sourceEvidence = async (
  source: DataSource,
  matching: LieuxMediationNumeriqueMatching
): Promise<SourceEvidence> => {
  const localisation: Localisation = await processLocalisation(
    source,
    matching,
    async (): Promise<Localisation> => NO_LOCALISATION
  );
  const complement: string | undefined = source[matching.complement_adresse?.colonne ?? '']?.toString();

  return {
    ...(localisation == null ? {} : { localisation }),
    ...(complement == null ? {} : { complement }),
    origine: rawAddressLabel(source, matching)
  };
};

export const getAddressData =
  (
    adresse: NormalizedAddress,
    matching: LieuxMediationNumeriqueMatching,
    evidence: SourceEvidence,
    response?: BatchGeocoding
  ) =>
  async (arrayFromStorage: AddressRecord[]): Promise<LocationEnriched> => {
    const addresseOriginale: string = addressLabel(adresse);
    const cached: AddressRecord | undefined = cachedFor(arrayFromStorage, addresseOriginale);

    if (cached?.responseBan != null)
      return {
        data: geocodedColumns(matching, cached.responseBan, complementFor(evidence, cached.responseBan)),
        statut: 'from_storage'
      };

    if (isRecentFailedAttempt(cached)) return { statut: 'from_storage', addresseOriginale };

    // Le contrôle de complétude vient après celui de fraîcheur : le placer avant réinscrivait au
    // cache, à chaque exécution, les adresses incomplètes — qui ne sont jamais soumises à la BAN.
    if (isMissingFields(adresse)) return { statut: 'no_from_storage', addresseOriginale };

    if (response === GEOCODING_UNAVAILABLE) return { statut: 'geocoding_unavailable', addresseOriginale };

    const fresh: Feature | undefined = response == null ? undefined : acceptedFeature(evidence, response);

    if (fresh == null || response == null) return { statut: 'no_from_storage', addresseOriginale };

    return {
      data: geocodedColumns(matching, fresh, complementFor(evidence, fresh)),
      addresseOriginale,
      responses: response.data,
      statut: 'from_api'
    };
  };
