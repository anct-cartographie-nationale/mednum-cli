import { Adresse, Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import axios, { AxiosResponse } from 'axios';
import { NO_LOCALISATION } from '../../fields';
import { DataSource, LieuxMediationNumeriqueMatching } from '../../input';
import { voieField } from '../../fields/adresse/clean-voie';
import { AddresseRecord } from '../../history';

const isValid = (adresse: Adresse, response: AxiosResponse): boolean =>
  response.data.features[0]?.geometry?.coordinates != null &&
  (response.data.features[0].properties.score > 0.6 ||
    (response.data.features[0].properties.score > 0.4 && response.data.features[0].properties.city === adresse.commune));

const toLocalisation = (response: AxiosResponse): Localisation =>
  Localisation({
    latitude: response.data.features[0].geometry.coordinates[1],
    longitude: response.data.features[0].geometry.coordinates[0]
  });
const addresseBanifier = (response: AxiosResponse): Adresse =>
  Adresse({
    voie: response.data.features[0].properties.name,
    code_postal: response.data.features[0].properties.postcode,
    commune: response.data.features[0].properties.city,
    code_insee: response.data.features[0].properties.citycode || undefined // code_insee n'est pas toujours fourni
  });
export const localisationByGeocode = (adresse: Adresse) => async (): Promise<Localisation> => {
  const response: AxiosResponse = await axios.get(
    `https://data.geopf.fr/geocodage/search?q=${adresse.voie} ${adresse.code_postal} ${adresse.commune}`
  );

  return isValid(adresse, response) ? toLocalisation(response) : NO_LOCALISATION;
};

export type LOCATION_ENRICHIE = {
  data?: DataSource;
  responses?: FeatureCollection;
  statut: 'déjà traité' | 'corrigé' | Localisation;
};
export const label = (source: DataSource, matching: LieuxMediationNumeriqueMatching): string =>
  `${String(matching.adresse?.colonne ? source[matching.adresse.colonne] : '')} ${String(matching.code_postal?.colonne ? source[matching.code_postal.colonne] : '')} ${String(matching.commune?.colonne ? source[matching.commune.colonne] : '')}`;

export const coordinatesByGeocode =
  (source: DataSource, matching: LieuxMediationNumeriqueMatching) =>
  async (arrayDejaTraiter: AddresseRecord[]): Promise<LOCATION_ENRICHIE> => {
    const addresseSource = label(source, matching);
    const lieuExistant = arrayDejaTraiter.find((item) => item.addresseOriginale === addresseSource);

    if (lieuExistant) {
      const coordinates = Localisation({
        latitude: lieuExistant.responseBan?.geometry.coordinates[0] ?? 0,
        longitude: lieuExistant.responseBan?.geometry.coordinates[1] ?? 0
      });

      return {
        data: lieuExistant.responseBan
          ? ({
              ...source,
              ...{ [matching.adresse.colonne as string]: lieuExistant.responseBan.properties.name },
              ...{ [matching.code_postal?.colonne as string]: lieuExistant.responseBan.properties.postcode },
              ...{ [matching.code_insee?.colonne as string]: lieuExistant.responseBan.properties.citycode },
              ...{ [matching.commune?.colonne as string]: lieuExistant.responseBan.properties.city },
              ...{ [matching.latitude?.colonne as string]: coordinates.latitude },
              ...{ [matching.longitude?.colonne as string]: coordinates.longitude }
            } as DataSource)
          : source,
        statut: 'déjà traité'
      };
    }

    const response: AxiosResponse = await axios.get(
      `https://api-adresse.data.gouv.fr/search?q=${voieField(source, matching.adresse)} ${source[matching.code_postal.colonne]} ${source[matching.commune.colonne]}`
    );

    if (response?.data?.features?.length === 0 || response?.data?.features[0].properties.score <= 0.9)
      return { statut: NO_LOCALISATION };

    return {
      data: {
        [matching.adresse?.colonne as string]: addresseBanifier(response).voie,
        [matching.code_postal?.colonne as string]: addresseBanifier(response).code_postal,
        [matching.code_insee?.colonne as string]: addresseBanifier(response).code_insee,
        [matching.commune?.colonne as string]: addresseBanifier(response).commune,
        [matching.latitude?.colonne as string]: toLocalisation(response).latitude,
        [matching.longitude?.colonne as string]: toLocalisation(response).longitude
      },
      responses: response.data as FeatureCollection,
      statut: 'corrigé'
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
