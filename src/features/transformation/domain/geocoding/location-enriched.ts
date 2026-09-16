import type { Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { Feature, FeatureCollection } from '../../../../libraries/ban';
import { type AddressRecord, isRecentFailedAttempt } from '../address-cache';
import type { DataSource, LieuxMediationNumeriqueMatching } from '../matching';
import { acceptedFeature, complementFor, rejectionReason, UNRESOLVED_REASONS, type UnresolvedReason } from './acceptance';
import { addressLabel, isMissingFields, type NormalizedAddress } from './address-to-geocode';
import { type BatchGeocoding, GEOCODING_UNAVAILABLE, localisationOf } from './ban-response';
import type { SourceEvidence } from './source-evidence';

export type LocationEnriched = {
  data?: DataSource;
  responses?: FeatureCollection;
  addresseOriginale?: string;
  motif?: UnresolvedReason;
  statut: 'no_from_storage' | 'from_storage' | 'from_api' | 'geocoding_unavailable';
};

/**
 * Ce que le géocodage rend à la source : les seules colonnes qu'il a le droit de réécrire, dans
 * les noms que la correspondance leur donne.
 */
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
 * Le parcours d'une adresse, du cache à la Base Adresse Nationale. L'ordre des retours est la
 * règle elle-même : ce que l'on sait déjà, puis ce qu'on s'interdit de redemander, puis ce qu'on
 * ne sait pas demander, et enfin ce que le référentiel vient de répondre.
 */
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

    if (isRecentFailedAttempt(cached))
      return { statut: 'from_storage', addresseOriginale, motif: UNRESOLVED_REASONS.recentlyFailed };

    // Le contrôle de complétude vient après celui de fraîcheur : le placer avant réinscrivait au
    // cache, à chaque exécution, les adresses incomplètes — qui ne sont jamais soumises à la BAN.
    if (isMissingFields(adresse)) return { statut: 'no_from_storage', addresseOriginale, motif: UNRESOLVED_REASONS.incomplete };

    if (response === GEOCODING_UNAVAILABLE)
      return { statut: 'geocoding_unavailable', addresseOriginale, motif: UNRESOLVED_REASONS.geocoderUnavailable };

    const fresh: Feature | undefined = response == null ? undefined : acceptedFeature(evidence, response);

    if (fresh == null || response == null)
      return { statut: 'no_from_storage', addresseOriginale, motif: rejectionReason(evidence, response) };

    return {
      data: geocodedColumns(matching, fresh, complementFor(evidence, fresh)),
      addresseOriginale,
      responses: response.data,
      statut: 'from_api'
    };
  };
