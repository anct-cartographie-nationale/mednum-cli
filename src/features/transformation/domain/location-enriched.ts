import { type Adresse, Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { BanAddressRow, Feature, FeatureCollection } from '../../../libraries/ban';
import { type AddressRecord, isRecentFailedAttempt } from './address-cache';
import { toCleanField } from './fields/adresse/clean-operations';
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

export const isAboveBatchScore = (response?: BanResponse | null): boolean =>
  (response?.data.features[0]?.properties.score ?? 0) > MINIMUM_BATCH_SCORE;

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

const geocodedColumns = (matching: LieuxMediationNumeriqueMatching, feature: Feature): DataSource => {
  const { latitude, longitude }: Localisation = localisationOf(feature);

  return {
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

const freshGeocodingFrom = (response?: BanResponse | null): Feature | undefined =>
  isAboveBatchScore(response) ? response?.data.features[0] : undefined;

export const getAddressData =
  (adresse: NormalizedAddress, matching: LieuxMediationNumeriqueMatching, response?: BatchGeocoding) =>
  async (arrayFromStorage: AddressRecord[]): Promise<LocationEnriched> => {
    const addresseOriginale: string = addressLabel(adresse);
    const cached: AddressRecord | undefined = cachedFor(arrayFromStorage, addresseOriginale);

    if (cached?.responseBan != null) return { data: geocodedColumns(matching, cached.responseBan), statut: 'from_storage' };

    if (isRecentFailedAttempt(cached)) return { statut: 'from_storage', addresseOriginale };

    // Le contrôle de complétude vient après celui de fraîcheur : le placer avant réinscrivait au
    // cache, à chaque exécution, les adresses incomplètes — qui ne sont jamais soumises à la BAN.
    if (isMissingFields(adresse)) return { statut: 'no_from_storage', addresseOriginale };

    if (response === GEOCODING_UNAVAILABLE) return { statut: 'geocoding_unavailable', addresseOriginale };

    const fresh: Feature | undefined = freshGeocodingFrom(response);

    if (fresh == null || response == null) return { statut: 'no_from_storage', addresseOriginale };

    return {
      data: geocodedColumns(matching, fresh),
      addresseOriginale,
      responses: response.data,
      statut: 'from_api'
    };
  };
