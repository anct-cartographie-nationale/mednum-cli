import axios, { type AxiosResponse } from 'axios';
import { toCsvText } from '../csv/index';
import toJson from 'csvtojson';
import { BAN_RESULT_FIELDS, type BanAddressRow, type BanResultRow, type FeatureCollection } from './ban.types';

const GEOCODAGE_URL = 'https://data.geopf.fr/geocodage/search';
const BAN_CSV_URL = 'https://api-adresse.data.gouv.fr/search/csv';

export type PostCsv = (url: string, formData: FormData) => Promise<string>;

/** Ce que l'appelant utilise de la réponse, et rien de plus : le transport reste ici. */
export type BanSearchResult = {
  data: FeatureCollection;
};

export const searchAddress = async (query: string): Promise<BanSearchResult> => ({
  // Affirmation : la BAN rend une collection de features. Rien ne le vérifie.
  data: (await axios.get(`${GEOCODAGE_URL}?q=${query}`)).data as FeatureCollection
});

export const postBanCsv: PostCsv = (url: string, formData: FormData): Promise<string> =>
  axios.post<string>(url, formData, { responseType: 'text' }).then((response: AxiosResponse<string>): string => response.data);

const banFormData = (rows: BanAddressRow[]): FormData => {
  const formData = new FormData();
  formData.append('data', new Blob([toCsvText(rows)], { type: 'text/csv' }), 'data.csv');
  formData.append('columns', 'voie');
  formData.append('columns', 'commune');
  formData.append('postcode', 'codePostal');
  for (const field of BAN_RESULT_FIELDS) {
    formData.append('result_columns', field);
  }

  return formData;
};

/**
 * Géocodage par lot : la BAN accepte un CSV d'adresses et renvoie le même CSV enrichi des
 * colonnes de résultat. `postCsv` est passé en paramètre pour rester substituable sous test.
 */
export const geocodeCsv = async (rows: BanAddressRow[], postCsv: PostCsv = postBanCsv): Promise<BanResultRow[]> =>
  toJson().fromString(await postCsv(BAN_CSV_URL, banFormData(rows)));

export const toFeatureCollection = (row: BanResultRow): FeatureCollection => ({
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
});
