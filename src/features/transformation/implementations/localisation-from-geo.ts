import type { Adresse, Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import {
  type BanAddressRow,
  type BanSearchResult,
  type BanResultRow,
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

const isValid = (adresse: Adresse, response: BanResponse): boolean =>
  response.data.features[0]?.geometry?.coordinates != null &&
  ((response.data.features[0]?.properties?.score ?? 0) > 0.6 ||
    ((response.data.features[0]?.properties?.score ?? 0) > 0.4 &&
      response.data.features[0]?.properties?.city === adresse.commune));

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
  const geocodeIndices: number[] = batch.reduce<number[]>((indices: number[], source: DataSource, index: number): number[] => {
    const isInCache: boolean = arrayFromStorage.some(
      (record: AddressRecord): boolean => addressLabel(source, matching) === record?.addresseOriginale
    );
    return isInCache || isMissingFields(source, matching) ? indices : [...indices, index];
  }, []);

  if (geocodeIndices.length === 0) return batch.map((): null => null);

  const rows: BanAddressRow[] = geocodeIndices
    .map((index: number): DataSource | undefined => batch[index])
    .filter((source: DataSource | undefined): source is DataSource => source != null)
    .map((source: DataSource): BanAddressRow => banRowFor(source, matching));

  try {
    const results: BanResultRow[] = await geocodeCsv(rows, postCsv);
    const resultsByIndex = new Map(
      geocodeIndices.map((batchIndex: number, position: number): [number, BanResultRow | undefined] => [
        batchIndex,
        results[position]
      ])
    );

    return batch.map((_: DataSource, index: number): BanResponse | null => {
      const result: BanResultRow | undefined = resultsByIndex.get(index);
      if (result == null || !hasUsableName(result)) return null;
      const response: BanResponse = { data: toFeatureCollection(result) };
      return isAboveBatchScore(response) ? response : null;
    });
  } catch (error: unknown) {
    console.error("[BAN batch] Erreur lors de l'appel ou du parsing CSV", error);
    return batch.map((): null => null);
  }
};
