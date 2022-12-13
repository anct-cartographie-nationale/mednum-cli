import { Dataset, PostDataset } from '../mednum';
import axios from 'axios';
/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import * as fs from 'fs';
/* eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/naming-convention, @typescript-eslint/typedef, @typescript-eslint/no-shadow, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const FormData = require('form-data');

export type Ressource = {
  name: string;
  source: string;
};

type Headers = Record<string, string>;

export type PublishDatasetRepository = {
  get: (ownerId: string) => Promise<Dataset[]>;
  post: (datasetToCreate: PostDataset) => Promise<Dataset>;
  update: (datasetToUpdate: PostDataset, dataset: Dataset) => Promise<Dataset>;
  addRessourceTo: (dataset: Dataset) => (ressource: Ressource) => Promise<void>;
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
  async (ressource: Ressource): Promise<void> => {
    const formData: typeof FormData = new FormData();
    formData.append('file', fs.readFileSync(`${ressource.source}/${ressource.name}`), ressource.name);

    await axios.post<Dataset>(
      `${API_URL}/datasets/${dataset.id}/upload`,
      formData.getBuffer(),
      headers(formData.getHeaders(authHeader(apiKey)))
    );
  };

export const publishDatasetRepository = (apiKey: string): PublishDatasetRepository => ({
  get: getDataset,
  post: postDataset(apiKey),
  update: updateDataset(apiKey),
  addRessourceTo: addRessourceTo(apiKey)
});
