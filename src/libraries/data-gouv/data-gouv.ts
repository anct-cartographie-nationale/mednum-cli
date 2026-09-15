import * as fs from 'node:fs';
import axios, { type AxiosResponse } from 'axios';
import FormData from 'form-data';
import { type Api, authHeader, followPages, headers, type Page, type ReadPage } from '../http/index.js';

/**
 * Client de l'API data.gouv. Il ne parle que le vocabulaire de data.gouv : la traduction vers
 * le modèle métier appartient à celui qui l'appelle.
 *
 * Les écritures gardent le paramètre de type de leur charge utile — il décrit ce qu'on envoie,
 * et le compilateur le vérifie. Celui de la réponse est retiré : rien ne vérifie ce qui revient,
 * et l'affirmation se fait désormais là où on la fait.
 */

export type DataGouvRessource = {
  created_at: Date;
  description: string;
  filesize: number;
  filetype: string;
  format: string;
  id: string;
  last_modified: Date;
  mime: string;
  published: Date;
  schema?: { name: string };
  title: string;
  type: string;
};

export type DataGouvDataset = {
  id: string;
  created_at: Date;
  description: string;
  filesize: number;
  filetype: string;
  format: string;
  last_modified: Date;
  published: Date;
  schema: { name: string };
  title: string;
  type: string;
  frequency: string;
  resources: DataGouvRessource[];
};

export type DataGouvDatasetPayload = {
  description: string;
  frequency: string;
  title: string;
  license: string;
  organization?: { id: string };
  tags: string;
  temporal_coverage?: {
    start: string;
    end: string;
  };
  spatial: {
    zones: string;
    granularity: string;
  };
};

export type DataGouvReference = {
  id: string;
  isOwner: boolean;
};

const referenceQueryParams = ({ id, isOwner }: DataGouvReference): string => (isOwner ? `owner=${id}` : `organization=${id}`);

const fileNameOf = (source: string): string | undefined => source.split('/').pop();

/**
 * Taille de page demandée. data.gouv sert 2000 et refuse 10000 par une 502 : il n'existe pas
 * de valeur assez grande pour se dispenser de pagination, seulement des valeurs qui tiennent.
 */
const DATASETS_PAGE_SIZE = 1000;

type DataGouvDatasetsPage = {
  data?: unknown;
  next_page?: unknown;
};

/**
 * Stratégie data.gouv : la page suivante est l'URL complète portée par `next_page`, qui
 * reconduit d'elle-même les paramètres de la requête d'origine.
 */
const readDatasetsPage =
  (): ReadPage<string> =>
  async (url: string): Promise<Page<string>> => {
    const body: DataGouvDatasetsPage = (await axios.get(url, headers())).data;

    if (!Array.isArray(body.data)) throw new Error(`Réponse de data.gouv sans liste de jeux de données : ${url}`);

    return { records: body.data, next: typeof body.next_page === 'string' ? body.next_page : undefined };
  };

/**
 * Toutes les pages, pas seulement la première. Celui qui appelle y cherche un jeu de données
 * existant pour le mettre à jour : n'en voir qu'une partie le ferait publier un doublon.
 */
export const listDataGouvDatasets = async (api: Api, reference: DataGouvReference): Promise<DataGouvDataset[]> =>
  (await followPages(
    `${api.url}/datasets/?${referenceQueryParams(reference)}&page_size=${DATASETS_PAGE_SIZE}`,
    readDatasetsPage()
  )) as DataGouvDataset[];

export const createDataGouvDataset = async (api: Api, payload: DataGouvDatasetPayload): Promise<DataGouvDataset> =>
  (
    await axios.post<unknown, AxiosResponse<unknown>, DataGouvDatasetPayload>(
      `${api.url}/datasets`,
      payload,
      headers(authHeader(api.key))
    )
  ).data as DataGouvDataset;

export const replaceDataGouvDataset = async (
  api: Api,
  datasetId: string,
  payload: DataGouvDatasetPayload
): Promise<DataGouvDataset> =>
  (
    await axios.put<unknown, AxiosResponse<unknown>, DataGouvDatasetPayload>(
      `${api.url}/datasets/${datasetId}`,
      payload,
      headers(authHeader(api.key))
    )
  ).data as DataGouvDataset;

const uploadTo = async (api: Api, uploadUrl: string, source: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', fs.readFileSync(source), fileNameOf(source));

  return (
    (await axios.post(uploadUrl, formData.getBuffer(), headers(formData.getHeaders(authHeader(api.key)))))
      .data as DataGouvRessource
  ).id;
};

export const addDataGouvRessource = async (api: Api, datasetId: string, source: string): Promise<string> =>
  uploadTo(api, `${api.url}/datasets/${datasetId}/upload`, source);

export const replaceDataGouvRessource = async (
  api: Api,
  datasetId: string,
  ressourceId: string | undefined,
  source: string
): Promise<string> => uploadTo(api, `${api.url}/datasets/${datasetId}/resources/${ressourceId}/upload`, source);

export const describeDataGouvRessource = async (
  api: Api,
  datasetId: string,
  ressourceId: string,
  description: { schema: string; description: string }
): Promise<void> => {
  await axios.put<DataGouvRessource>(
    `${api.url}/datasets/${datasetId}/resources/${ressourceId}`,
    { schema: { name: description.schema }, description: description.description },
    headers(authHeader(api.key))
  );
};
