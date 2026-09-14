import { Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { BanAddressRow, FeatureCollection } from '../../../libraries/ban';
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

export const labelVoie = (source: DataSource, matching: LieuxMediationNumeriqueMatching): string =>
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

const addressBan = (response: BanResponse) => ({
  voie: response.data.features[0]?.properties?.name ?? '',
  code_postal: response.data.features[0]?.properties?.postcode ?? '',
  commune: response.data.features[0]?.properties?.city ?? '',
  code_insee: response.data.features[0]?.properties?.citycode ?? ''
});

/**
 * Rapproche une source de ce que l'on sait déjà de son adresse : le cache des adresses déjà
 * géocodées d'abord, la réponse fraîche de la BAN ensuite.
 */
export const getAddressData =
  (source: DataSource, matching: LieuxMediationNumeriqueMatching, response?: BanResponse | null) =>
  async (arrayFromStorage: AddressRecord[]): Promise<LocationEnriched> => {
    const addressSource: string = addressLabel(source, matching);
    const existingLieu: AddressRecord | undefined = arrayFromStorage.find(
      (item: AddressRecord): boolean => item.addresseOriginale === addressSource
    );
    const addresseOriginale: string = `${source[matching?.adresse?.colonne ?? '']} ${labelCodePostal(source, matching)} ${labelCommune(source, matching)}`;

    if (isMissingFields(source, matching)) return { statut: 'no_from_storage', addresseOriginale };

    if (existingLieu && !existingLieu?.responseBan) return { statut: 'from_storage', addresseOriginale };

    if (existingLieu?.responseBan) {
      const coordinates: Localisation = Localisation({
        latitude: existingLieu.responseBan.geometry.coordinates[1] ?? 0,
        longitude: existingLieu.responseBan.geometry.coordinates[0] ?? 0
      });

      return {
        data: {
          ...source,
          [matching.adresse.colonne as string]: existingLieu.responseBan.properties.name,
          [matching.code_postal?.colonne as string]: existingLieu.responseBan.properties.postcode,
          [matching.code_insee?.colonne as string]: existingLieu.responseBan.properties.citycode,
          [matching.commune?.colonne as string]: existingLieu.responseBan.properties.city,
          [matching.latitude?.colonne as string]: coordinates.latitude,
          [matching.longitude?.colonne as string]: coordinates.longitude
        } as DataSource,
        statut: 'from_storage'
      };
    }

    if (response?.data?.features?.[0] == null || !isAboveBatchScore(response))
      return { statut: 'no_from_storage', addresseOriginale };

    const ban = addressBan(response);
    return {
      data: {
        [matching.adresse?.colonne as string]: ban.voie,
        [matching.code_postal?.colonne as string]: ban.code_postal,
        [matching.code_insee?.colonne as string]: ban.code_insee,
        [matching.commune?.colonne as string]: ban.commune,
        [matching.latitude?.colonne as string]: toLocalisation(response).latitude,
        [matching.longitude?.colonne as string]: toLocalisation(response).longitude
      },
      addresseOriginale,
      responses: response.data,
      statut: 'from_api'
    };
  };
