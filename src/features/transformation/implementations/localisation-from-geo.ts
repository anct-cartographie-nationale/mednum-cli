import type { Adresse, Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import {
  type BanAddressRow,
  type BanSearchResult,
  type BanResultRow,
  type Feature,
  geocodeCsv,
  type PostCsv,
  postBanCsv,
  searchAddress,
  toFeatureCollection
} from '../../../libraries/ban';
import { type AddressRecord, type Geocode, isRecentFailedAttempt, type NormalizedAddress } from '../domain';
import {
  addressLabel,
  banRowFor,
  type BanResponse,
  type BatchGeocoding,
  GEOCODING_UNAVAILABLE,
  GeocodingError,
  isMissingFields,
  NO_LOCALISATION,
  toLocalisation
} from '../domain';

/**
 * Seuils du géocodage unitaire, plus permissifs que celui du lot : au dessus du premier, le
 * rapprochement se suffit à lui-même ; entre les deux, il n'est retenu que si la BAN s'accorde
 * avec la source sur la commune.
 */
const CONFIDENT_SCORE = 0.6;
const PLAUSIBLE_SCORE = 0.4;

const isTrustworthy = (feature: Feature, adresse: Adresse): boolean => {
  const score: number = feature.properties?.score ?? 0;

  return score > CONFIDENT_SCORE || (score > PLAUSIBLE_SCORE && feature.properties?.city === adresse.commune);
};

const isValid = (adresse: Adresse, response: BanResponse): boolean => {
  const feature: Feature | undefined = response.data.features[0];

  return feature?.geometry?.coordinates != null && isTrustworthy(feature, adresse);
};

/**
 * Géocodage unitaire. Les erreurs de transport sont traduites en GeocodingError : le domaine
 * écarte alors le lieu sans rien connaître du réseau.
 */
export const localisationByGeocode: Geocode = (adresse: Adresse) => async (): Promise<Localisation> => {
  try {
    const response: BanSearchResult = await searchAddress(`${adresse.voie} ${adresse.code_postal} ${adresse.commune}`);

    return isValid(adresse, response) ? toLocalisation(response) : NO_LOCALISATION;
  } catch (error: unknown) {
    throw new GeocodingError(`Le géocodage de l'adresse « ${addresseOf(adresse)} » a échoué`, error);
  }
};

const addresseOf = (adresse: Adresse): string => `${adresse.voie} ${adresse.code_postal} ${adresse.commune}`;

const hasUsableName = (row?: BanResultRow): boolean =>
  row != null && [row.result_housenumber, row.result_street].filter(Boolean).join(' ') !== '';

const noGeocoding = (adresses: NormalizedAddress[]): null[] => adresses.map((): null => null);

const geocodingUnavailable = (adresses: NormalizedAddress[]): (typeof GEOCODING_UNAVAILABLE)[] =>
  adresses.map((): typeof GEOCODING_UNAVAILABLE => GEOCODING_UNAVAILABLE);

const needsGeocoding = (adresse: NormalizedAddress, arrayFromStorage: AddressRecord[]): boolean =>
  !isMissingFields(adresse) &&
  !arrayFromStorage.some(
    (record: AddressRecord): boolean =>
      addressLabel(adresse) === record?.addresseOriginale && (record.responseBan != null || isRecentFailedAttempt(record))
  );

const indicesToGeocode = (adresses: NormalizedAddress[], arrayFromStorage: AddressRecord[]): number[] =>
  adresses.flatMap((adresse: NormalizedAddress, index: number): number[] =>
    needsGeocoding(adresse, arrayFromStorage) ? [index] : []
  );

const banRowsAt = (adresses: NormalizedAddress[], indices: number[]): BanAddressRow[] =>
  indices
    .map((index: number): NormalizedAddress | undefined => adresses[index])
    .filter((adresse: NormalizedAddress | undefined): adresse is NormalizedAddress => adresse != null)
    .map(banRowFor);

const resultsByBatchIndex = (indices: number[], results: BanResultRow[]): Map<number, BanResultRow | undefined> =>
  new Map(
    indices.map((batchIndex: number, position: number): [number, BanResultRow | undefined] => [batchIndex, results[position]])
  );

/**
 * Le score n'est plus jugé ici : c'est au domaine de trancher, lui seul sachant si la source
 * corrobore par ses propres coordonnées un rapprochement que le score ferait rejeter. Ne reste
 * que ce qui rend la réponse inexploitable d'emblée — ni numéro ni voie, donc aucun point.
 */
const usableResponseFrom = (result?: BanResultRow): BanResponse | null =>
  result == null || !hasUsableName(result) ? null : { data: toFeatureCollection(result) };

/**
 * Géocodage par lot. Seules les adresses absentes du cache et complètes sont envoyées à la
 * BAN ; le résultat est réaligné sur les positions du lot d'origine.
 */
export const fetchBanResponseBatch = async (
  adresses: NormalizedAddress[],
  arrayFromStorage: AddressRecord[],
  postCsv: PostCsv = postBanCsv
): Promise<BatchGeocoding[]> => {
  const indices: number[] = indicesToGeocode(adresses, arrayFromStorage);

  if (indices.length === 0) return noGeocoding(adresses);

  try {
    const results: BanResultRow[] = await geocodeCsv(banRowsAt(adresses, indices), postCsv);

    // La BAN rend une ligne par ligne envoyée, même sans correspondance : un résultat vide n'est
    // donc pas un « rien trouvé », c'est une réponse qu'on ne sait pas exploiter.
    if (results.length === 0) return geocodingUnavailable(adresses);

    const resultAt: Map<number, BanResultRow | undefined> = resultsByBatchIndex(indices, results);

    return adresses.map((_: NormalizedAddress, index: number): BanResponse | null => usableResponseFrom(resultAt.get(index)));
  } catch (error: unknown) {
    console.error("[BAN batch] Erreur lors de l'appel ou du parsing CSV", error);
    return geocodingUnavailable(adresses);
  }
};
