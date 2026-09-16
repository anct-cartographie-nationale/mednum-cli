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
import type { AddressRecord, Geocode } from '../domain';
import {
  addressLabel,
  banRowFor,
  type BanResponse,
  GeocodingError,
  isAboveBatchScore,
  isMissingFields,
  NO_LOCALISATION,
  toLocalisation
} from '../domain';
import type { DataSource, LieuxMediationNumeriqueMatching } from '../domain';

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

const noGeocoding = (batch: DataSource[]): null[] => batch.map((): null => null);

const needsGeocoding = (
  source: DataSource,
  matching: LieuxMediationNumeriqueMatching,
  arrayFromStorage: AddressRecord[]
): boolean =>
  !isMissingFields(source, matching) &&
  !arrayFromStorage.some((record: AddressRecord): boolean => addressLabel(source, matching) === record?.addresseOriginale);

const indicesToGeocode = (
  batch: DataSource[],
  matching: LieuxMediationNumeriqueMatching,
  arrayFromStorage: AddressRecord[]
): number[] =>
  batch.flatMap((source: DataSource, index: number): number[] =>
    needsGeocoding(source, matching, arrayFromStorage) ? [index] : []
  );

const banRowsAt = (batch: DataSource[], matching: LieuxMediationNumeriqueMatching, indices: number[]): BanAddressRow[] =>
  indices
    .map((index: number): DataSource | undefined => batch[index])
    .filter((source: DataSource | undefined): source is DataSource => source != null)
    .map((source: DataSource): BanAddressRow => banRowFor(source, matching));

const resultsByBatchIndex = (indices: number[], results: BanResultRow[]): Map<number, BanResultRow | undefined> =>
  new Map(
    indices.map((batchIndex: number, position: number): [number, BanResultRow | undefined] => [batchIndex, results[position]])
  );

const usableResponseFrom = (result?: BanResultRow): BanResponse | null => {
  if (result == null || !hasUsableName(result)) return null;

  const response: BanResponse = { data: toFeatureCollection(result) };

  return isAboveBatchScore(response) ? response : null;
};

/**
 * Géocodage par lot. Seules les adresses absentes du cache et complètes sont envoyées à la
 * BAN ; le résultat est réaligné sur les positions du lot d'origine.
 */
export const fetchBanResponseBatch = async (
  batch: DataSource[],
  matching: LieuxMediationNumeriqueMatching,
  arrayFromStorage: AddressRecord[],
  postCsv: PostCsv = postBanCsv
): Promise<(BanResponse | null)[]> => {
  const indices: number[] = indicesToGeocode(batch, matching, arrayFromStorage);

  if (indices.length === 0) return noGeocoding(batch);

  try {
    const results: BanResultRow[] = await geocodeCsv(banRowsAt(batch, matching, indices), postCsv);
    const resultAt: Map<number, BanResultRow | undefined> = resultsByBatchIndex(indices, results);

    return batch.map((_: DataSource, index: number): BanResponse | null => usableResponseFrom(resultAt.get(index)));
  } catch (error: unknown) {
    console.error("[BAN batch] Erreur lors de l'appel ou du parsing CSV", error);
    return noGeocoding(batch);
  }
};
