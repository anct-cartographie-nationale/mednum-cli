import { Adresse, Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import axios, { AxiosResponse } from 'axios';
import { stringify } from 'csv-stringify/sync';
import toJson from 'csvtojson';
import { NO_LOCALISATION } from '../../fields';
import { DataSource, LieuxMediationNumeriqueMatching } from '../../input';
import { voieField } from '../../fields/adresse/clean-voie';
import { AddressRecord } from '../../storage';

const RESULT_FIELDS = [
  'longitude',
  'latitude',
  'result_score',
  'result_housenumber',
  'result_street',
  'result_postcode',
  'result_citycode',
  'result_city',
  'result_label'
] as const;
type CsvResultField = (typeof RESULT_FIELDS)[number];
type CsvInputRow = { voie: string; codePostal: string; commune: string };
type CsvResultRow = CsvInputRow & Record<CsvResultField, string>;

const isValid = (adresse: Adresse, response: { data: FeatureCollection }): boolean =>
  response.data.features[0]?.geometry?.coordinates != null &&
  ((response.data.features[0]?.properties?.score ?? 0) > 0.6 ||
    ((response.data.features[0]?.properties?.score ?? 0) > 0.4 &&
      response.data.features[0]?.properties?.city === adresse.commune));

const toLocalisation = (response: { data: FeatureCollection }): Localisation =>
  Localisation({
    latitude: response.data.features[0]?.geometry?.coordinates[1] ?? 0,
    longitude: response.data.features[0]?.geometry?.coordinates[0] ?? 0
  });

const addressBan = (response: { data: FeatureCollection }) => ({
  voie: response.data.features[0]?.properties?.name ?? '',
  code_postal: response.data.features[0]?.properties?.postcode ?? '',
  commune: response.data.features[0]?.properties?.city ?? '',
  code_insee: response.data.features[0]?.properties?.citycode ?? ''
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
  addresseOriginale?: string;
  statut: 'no_from_storage' | 'from_storage' | 'from_api';
};
export const labelVoie = (source: DataSource, matching: LieuxMediationNumeriqueMatching): string =>
  String(voieField(source, matching.adresse));

const firstValueFrom = (source: DataSource, colonne: string | string[]): string =>
  [colonne]
    .flat()
    .map((c) => source[c]?.toString())
    .find(Boolean) ?? '';

export const labelCodePostal = (source: DataSource, matching: LieuxMediationNumeriqueMatching): string =>
  firstValueFrom(source, matching.code_postal.colonne);

export const labelCommune = (source: DataSource, matching: LieuxMediationNumeriqueMatching): string =>
  firstValueFrom(source, matching.commune.colonne);

export const label = (source: DataSource, matching: LieuxMediationNumeriqueMatching): string =>
  `${labelVoie(source, matching)} ${labelCodePostal(source, matching)} ${labelCommune(source, matching)}`;

const isMissingFields = (source: DataSource, matching: LieuxMediationNumeriqueMatching): boolean =>
  firstValueFrom(source, matching.commune.colonne) === '' ||
  firstValueFrom(source, matching.code_postal.colonne) === '' ||
  labelVoie(source, matching) === '';

const toFeatureCollection = (row: CsvResultRow): { data: FeatureCollection } => ({
  data: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [Number(row.longitude), Number(row.latitude)] },
        properties: {
          score: Number(row.result_score),
          name: [row.result_housenumber, row.result_street].filter(Boolean).join(' '),
          postcode: row.result_postcode,
          citycode: row.result_citycode,
          city: row.result_city,
          label: row.result_label,
          housenumber: row.result_housenumber,
          street: row.result_street,
          id: '',
          type: 'housenumber' as const,
          x: 0,
          y: 0,
          context: '',
          importance: 0
        }
      }
    ],
    query: `${row.voie} ${row.codePostal} ${row.commune}`
  }
});

export const responsesBanAll = (url: string, formData: FormData): Promise<string> =>
  axios.post<string>(url, formData, { responseType: 'text' }).then((r) => r.data);

export const fetchBanResponseBatch = async (
  batch: DataSource[],
  matching: LieuxMediationNumeriqueMatching,
  arrayFromStorage: AddressRecord[],
  fetchBan: (url: string, formData: FormData) => Promise<string>
): Promise<Array<{ data: FeatureCollection } | null>> => {
  const geocodeIndices: number[] = batch.reduce<number[]>((acc, source, i) => {
    const isInCache = !!arrayFromStorage.find((s) => label(source, matching) === s?.addresseOriginale);
    if (!isInCache && !isMissingFields(source, matching)) acc.push(i);
    return acc;
  }, []);

  if (geocodeIndices.length === 0) return batch.map(() => null);

  const rows: CsvInputRow[] = geocodeIndices.map((i) => ({
    voie: labelVoie(batch[i]!, matching),
    codePostal: labelCodePostal(batch[i]!, matching),
    commune: labelCommune(batch[i]!, matching)
  }));

  const formData = new FormData();
  formData.append('data', new Blob([stringify(rows, { header: true })], { type: 'text/csv' }), 'data.csv');
  formData.append('columns', 'voie');
  formData.append('columns', 'commune');
  formData.append('postcode', 'codePostal');
  RESULT_FIELDS.forEach((field) => formData.append('result_columns', field));

  try {
    const csvResponse = await fetchBan('https://api-adresse.data.gouv.fr/search/csv', formData);
    const results: CsvResultRow[] = await toJson().fromString(csvResponse);

    const responsesByIndex = new Map(geocodeIndices.map((batchIndex, j) => [batchIndex, results[j]]));

    return batch.map((_, i) => {
      const result = responsesByIndex.get(i);
      if (!result?.result_score || Number(result.result_score) <= 0.9) return null;
      const nameFromFields = [result.result_housenumber, result.result_street].filter(Boolean).join(' ');
      if (!nameFromFields) {
        return null;
      }
      return toFeatureCollection(result);
    });
  } catch (error: unknown) {
    console.error("[BAN batch] Erreur lors de l'appel ou du parsing CSV", error);
    return batch.map(() => null);
  }
};

export const getAddressData =
  (source: DataSource, matching: LieuxMediationNumeriqueMatching, response?: { data: FeatureCollection } | null) =>
  async (arrayFromStorage: AddressRecord[]): Promise<LOCATION_ENRICHED> => {
    const addressSource = label(source, matching);
    const existingLieu = arrayFromStorage.find((item) => item.addresseOriginale === addressSource);
    const addresseOriginale: string = `${source[matching?.adresse?.colonne ?? '']} ${firstValueFrom(source, matching.code_postal.colonne)} ${firstValueFrom(source, matching.commune.colonne)}`;

    if (
      firstValueFrom(source, matching.commune.colonne) === '' ||
      firstValueFrom(source, matching.code_postal.colonne) === '' ||
      voieField(source, matching.adresse) === ''
    )
      return { statut: 'no_from_storage', addresseOriginale };

    if (existingLieu && !existingLieu?.responseBan) return { statut: 'from_storage', addresseOriginale };

    if (existingLieu?.responseBan) {
      const coordinates = Localisation({
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
    if (!response?.data?.features?.[0] || response.data.features[0].properties.score <= 0.9)
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
