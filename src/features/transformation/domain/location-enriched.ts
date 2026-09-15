import { Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { BanAddressRow, Feature, FeatureCollection } from '../../../libraries/ban';
import type { AddressRecord } from './address-cache';
import { voieField } from './fields/adresse/clean-voie';
import type { DataSource, LieuxMediationNumeriqueMatching } from './matching';

/**
 * Un géocodage n'est retenu qu'au delà de ce score : en deçà, la BAN a rapproché l'adresse
 * d'un voisinage plutôt que d'un point précis.
 */
const MINIMUM_BATCH_SCORE = 0.9;

export type BanResponse = { data: FeatureCollection };

export type LocationEnriched = {
  data?: DataSource;
  responses?: FeatureCollection;
  addresseOriginale?: string;
  statut: 'no_from_storage' | 'from_storage' | 'from_api';
};

const firstValueFrom = (source: DataSource, colonne: string | string[]): string =>
  [colonne]
    .flat()
    .map((c: string): string | undefined => source[c]?.toString())
    .find(Boolean) ?? '';

const labelVoie = (source: DataSource, matching: LieuxMediationNumeriqueMatching): string =>
  String(voieField(source, matching.adresse));

export const labelCodePostal = (source: DataSource, matching: LieuxMediationNumeriqueMatching): string =>
  firstValueFrom(source, matching.code_postal.colonne);

export const labelCommune = (source: DataSource, matching: LieuxMediationNumeriqueMatching): string =>
  firstValueFrom(source, matching.commune.colonne);

export const addressLabel = (source: DataSource, matching: LieuxMediationNumeriqueMatching): string =>
  `${labelVoie(source, matching)} ${labelCodePostal(source, matching)} ${labelCommune(source, matching)}`;

export const isMissingFields = (source: DataSource, matching: LieuxMediationNumeriqueMatching): boolean =>
  labelCommune(source, matching) === '' || labelCodePostal(source, matching) === '' || labelVoie(source, matching) === '';

export const banRowFor = (source: DataSource, matching: LieuxMediationNumeriqueMatching): BanAddressRow => ({
  voie: labelVoie(source, matching),
  codePostal: labelCodePostal(source, matching),
  commune: labelCommune(source, matching)
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

const rawAddressLabel = (source: DataSource, matching: LieuxMediationNumeriqueMatching): string =>
  `${source[matching?.adresse?.colonne ?? '']} ${labelCodePostal(source, matching)} ${labelCommune(source, matching)}`;

const cachedGeocodingFor = (records: AddressRecord[], addressLabel: string): AddressRecord | undefined =>
  records.find((record: AddressRecord): boolean => record.addresseOriginale === addressLabel);

const freshGeocodingFrom = (response?: BanResponse | null): Feature | undefined =>
  isAboveBatchScore(response) ? response?.data.features[0] : undefined;

export const getAddressData =
  (source: DataSource, matching: LieuxMediationNumeriqueMatching, response?: BanResponse | null) =>
  async (arrayFromStorage: AddressRecord[]): Promise<LocationEnriched> => {
    const addresseOriginale: string = rawAddressLabel(source, matching);

    if (isMissingFields(source, matching)) return { statut: 'no_from_storage', addresseOriginale };

    const cached: AddressRecord | undefined = cachedGeocodingFor(arrayFromStorage, addressLabel(source, matching));

    if (cached?.responseBan != null) return { data: geocodedColumns(matching, cached.responseBan), statut: 'from_storage' };

    if (cached != null) return { statut: 'from_storage', addresseOriginale };

    const fresh: Feature | undefined = freshGeocodingFrom(response);

    if (fresh == null || response == null) return { statut: 'no_from_storage', addresseOriginale };

    return {
      data: geocodedColumns(matching, fresh),
      addresseOriginale,
      responses: response.data,
      statut: 'from_api'
    };
  };
