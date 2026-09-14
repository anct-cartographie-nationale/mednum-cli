import * as fs from 'node:fs';
import axios, { type AxiosResponse } from 'axios';
import FormData from 'form-data';
import { type Api, authHeader, headers } from '../http/index.js';

/**
 * Client de l'API data.gouv. Il ne parle que le vocabulaire de data.gouv : la traduction vers
 * le modèle métier appartient à celui qui l'appelle.
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

const referenceQueryParams = ({ id, isOwner }: DataGouvReference): string =>
  isOwner ? `?owner=${id}&page_size=10000` : `?organization=${id}`;

const fileNameOf = (source: string): string | undefined => source.split('/').pop();

export const listDataGouvDatasets = async (api: Api, reference: DataGouvReference): Promise<DataGouvDataset[]> =>
  (await axios.get(`${api.url}/datasets/${referenceQueryParams(reference)}&page_size=10000`, headers())).data.data;

export const createDataGouvDataset = async (api: Api, payload: DataGouvDatasetPayload): Promise<DataGouvDataset> =>
  (
    await axios.post<DataGouvDataset, AxiosResponse<DataGouvDataset>, DataGouvDatasetPayload>(
      `${api.url}/datasets`,
      payload,
      headers(authHeader(api.key))
    )
  ).data;

export const replaceDataGouvDataset = async (
  api: Api,
  datasetId: string,
  payload: DataGouvDatasetPayload
): Promise<DataGouvDataset> =>
  (
    await axios.put<DataGouvDataset, AxiosResponse<DataGouvDataset>, DataGouvDatasetPayload>(
      `${api.url}/datasets/${datasetId}`,
      payload,
      headers(authHeader(api.key))
    )
  ).data;

const uploadTo = async (api: Api, uploadUrl: string, source: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', fs.readFileSync(source), fileNameOf(source));

  return (
    await axios.post<DataGouvRessource>(uploadUrl, formData.getBuffer(), headers(formData.getHeaders(authHeader(api.key))))
  ).data.id;
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
