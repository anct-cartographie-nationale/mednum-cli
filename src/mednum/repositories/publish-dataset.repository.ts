import { Dataset, PostDataset, Ressource } from '../mednum';
import axios from 'axios';
/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import * as fs from 'fs';
/* eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/naming-convention, @typescript-eslint/typedef, @typescript-eslint/no-shadow, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const FormData = require('form-data');

export type PublishRessource = {
  id?: string;
  name: string;
  source: string;
  schema: string;
  description: string;
};

type Headers = Record<string, string>;

export type PublishDatasetRepository = {
  get: (ownerId: string) => Promise<Dataset[]>;
  post: (datasetToCreate: PostDataset) => Promise<Dataset>;
  update: (datasetToUpdate: PostDataset, dataset: Dataset) => Promise<Dataset>;
  addRessourceTo: (dataset: Dataset) => (ressource: PublishRessource) => Promise<void>;
};

const PROTOCOL: string = 'https://';
const HOST: string = 'demo.data.gouv.fr';
const API: string = '/api/1';
const API_URL: string = `${PROTOCOL}${HOST}${API}`;

const headers = (headersToAppend?: Headers): { headers: Headers } => ({
  headers: {
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    Accept: 'application/json',
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    'Content-Type': 'application/json',
    ...headersToAppend
  }
});

const authHeader = (apiKey: string): Headers => ({
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  'X-API-KEY': apiKey
});

const getDataset = async (ownerId: string): Promise<Dataset[]> =>
  (
    await axios
      // todo: switch between owner and organization
      // .get(`${API_URL}/datasets/?organization=${organization.id}`)
      .get(`${API_URL}/datasets/?owner=${ownerId}&page_size=10000`, headers())
  ).data.data;

const postDataset =
  (apiKey: string) =>
  async (datasetToCreate: PostDataset): Promise<Dataset> =>
    (await axios.post<Dataset>(`${API_URL}/datasets`, datasetToCreate, headers(authHeader(apiKey)))).data;

const updateDataset =
  (apiKey: string) =>
  async (datasetToUpdate: PostDataset, dataset: Dataset): Promise<Dataset> =>
    (await axios.put<Dataset>(`${API_URL}/datasets/${dataset.id}`, datasetToUpdate, headers(authHeader(apiKey)))).data;

const addRessourceTo =
  (apiKey: string) =>
  (dataset: Dataset) =>
  async (ressource: PublishRessource): Promise<void> => {
    const formData: typeof FormData = new FormData();
    formData.append('file', fs.readFileSync(`${ressource.source}/${ressource.name}`), ressource.name);

    const ressourceId: string = (
      await axios.post<Ressource>(
        ressource.id == null
          ? `${API_URL}/datasets/${dataset.id}/upload`
          : `${API_URL}/datasets/${dataset.id}/resources/${ressource.id}/upload`,
        formData.getBuffer(),
        headers(formData.getHeaders(authHeader(apiKey)))
      )
    ).data.id;

    await axios.put<Ressource>(
      `${API_URL}/datasets/${dataset.id}/resources/${ressourceId}`,
      {
        schema: { name: ressource.schema },
        description: ressource.description
      },
      headers(authHeader(apiKey))
    );
  };

export const publishDatasetRepository = (apiKey: string): PublishDatasetRepository => ({
  get: getDataset,
  post: postDataset(apiKey),
  update: updateDataset(apiKey),
  addRessourceTo: addRessourceTo(apiKey)
});
