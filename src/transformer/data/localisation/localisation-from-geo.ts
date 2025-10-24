import { Adresse, Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import axios, { AxiosResponse } from 'axios';
import { NO_LOCALISATION } from '../../fields';
import { DataSource, LieuxMediationNumeriqueMatching } from '../../input';
import { CLEAN_VOIE, voieField } from '../../fields/adresse/clean-voie';
import { AddressRecord } from '../../storage';
import { toCleanField } from '../../fields/adresse/clean-operations';

const isValid = (adresse: Adresse, response: AxiosResponse): boolean =>
  response.data.features[0]?.geometry?.coordinates != null &&
  (response.data.features[0].properties.score > 0.6 ||
    (response.data.features[0].properties.score > 0.4 && response.data.features[0].properties.city === adresse.commune));

const toLocalisation = (response: AxiosResponse): Localisation =>
  Localisation({
    latitude: response.data.features[0].geometry.coordinates[1],
    longitude: response.data.features[0].geometry.coordinates[0]
  });
const addressBan = (response: AxiosResponse): Adresse =>
  Adresse({
    voie: response.data.features[0].properties.name,
    code_postal: response.data.features[0].properties.postcode,
    commune: response.data.features[0].properties.city,
    code_insee: response.data.features[0].properties.citycode
  });
export const localisationByGeocode = (adresse: Adresse) => async (): Promise<Localisation> => {
  const response: AxiosResponse = await axios.get(
    `https://data.geopf.fr/geocodage/search?q=${adresse.voie} ${adresse.code_postal} ${adresse.commune}`
  );

  return isValid(adresse, response) ? toLocalisation(response) : NO_LOCALISATION;
};

export type LOCATION_ENRICHED = {
  data?: DataSource;
  responses?: FeatureCollection;
  statut: 'from_storage' | 'from_api' | Localisation;
};
export const label = (source: DataSource, matching: LieuxMediationNumeriqueMatching): string =>
  `${String(matching.adresse?.colonne ? source[matching.adresse.colonne] : '')} ${String(matching.code_postal?.colonne ? source[matching.code_postal.colonne] : '')} ${String(matching.commune?.colonne ? source[matching.commune.colonne] : '')}`;

export const getAddressData =
  (source: DataSource, matching: LieuxMediationNumeriqueMatching) =>
  async (arrayFromStorage: AddressRecord[]): Promise<LOCATION_ENRICHED> => {
    const addressSource = label(source, matching);
    const existingLieu = arrayFromStorage.find((item) => item.addresseOriginale === addressSource);

    if (existingLieu) {
      const coordinates = Localisation({
        latitude: existingLieu.responseBan?.geometry.coordinates[0] ?? 0,
        longitude: existingLieu.responseBan?.geometry.coordinates[1] ?? 0
      });

      return {
        data: existingLieu.responseBan
          ? ({
              ...source,
              ...{ [matching.adresse.colonne as string]: existingLieu.responseBan.properties.name },
              ...{ [matching.code_postal?.colonne as string]: existingLieu.responseBan.properties.postcode },
              ...{ [matching.code_insee?.colonne as string]: existingLieu.responseBan.properties.citycode },
              ...{ [matching.commune?.colonne as string]: existingLieu.responseBan.properties.city },
              ...{ [matching.latitude?.colonne as string]: coordinates.latitude },
              ...{ [matching.longitude?.colonne as string]: coordinates.longitude }
            } as DataSource)
          : source,
        statut: 'from_storage'
      };
    }
    const querySearch: string = `${CLEAN_VOIE.reduce(toCleanField, voieField(source, matching.adresse))} ${source[matching.code_postal.colonne]} ${source[matching.commune.colonne]}`;

    const response = await axios.get(`https://api-adresse.data.gouv.fr/search?q=${querySearch}`);

    if (response?.data?.features?.length === 0 || response?.data?.features[0].properties.score <= 0.9)
      return { statut: NO_LOCALISATION };

    return {
      data: {
        [matching.adresse?.colonne as string]: addressBan(response).voie,
        [matching.code_postal?.colonne as string]: addressBan(response).code_postal,
        [matching.code_insee?.colonne as string]: addressBan(response).code_insee,
        [matching.commune?.colonne as string]: addressBan(response).commune,
        [matching.latitude?.colonne as string]: toLocalisation(response).latitude,
        [matching.longitude?.colonne as string]: toLocalisation(response).longitude
      },
      responses: response.data as FeatureCollection,
      statut: 'from_api'
    };
  };

export type FeatureCollection = {
  type: 'FeatureCollection'; // Type de la collection de fonctionnalités
  features: Array<Feature>; // Liste des fonctionnalités
  query: string; // Requête initiale
};

export type Feature = {
  type: 'Feature'; // Type de la fonctionnalité
  geometry: Geometry; // Géométrie de la fonctionnalité
  properties: Properties; // Propriétés de la fonctionnalité
};

export type Geometry = {
  type: 'Point'; // Type de la géométrie
  coordinates: [number, number]; // Coordonnées géographiques (longitude, latitude)
};

/**
 * housenumber : numéro « à la plaque »
 * street : position « à la voie », placé approximativement au centre de celle-ci
 * locality : lieu-dit
 * municipality : numéro « à la commune »
 */
export type AdresseType = 'housenumber' | 'street' | 'locality' | 'municipality';

export type Properties = {
  label: string; // Adresse complète
  score: number; // Score de correspondance
  housenumber: string; // Numéro de la maison
  id: string; // Identifiant unique
  type: AdresseType; // Type de la fonctionnalité (e.g., "housenumber")
  name: string; // Nom de la rue avec le numéro de la maison
  postcode: string; // Code postal
  citycode: string; // Code INSEE de la ville
  x: number; // Coordonnée X (projection)
  y: number; // Coordonnée Y (projection)
  city: string; // Nom de la ville
  context: string; // Contexte géographique (e.g., département, région)
  importance: number; // Importance de la correspondance
  street: string; // Nom de la rue
};
