import { Dataset, PublishDataset, PublishRessource, Reference, Ressource } from '../mednum';
import axios from 'axios';
/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import * as fs from 'fs';
/* eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/naming-convention, @typescript-eslint/typedef, @typescript-eslint/no-shadow, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const FormData = require('form-data');
import { getDataset, postDataset, updateDataset } from './publish-dataset';
import { apiUrl, authHeader, headers } from './data-gouv.api';

export type PublishDatasetRepository = {
  get: (reference: Reference) => Promise<Dataset[]>;
  post: (datasetToCreate: PublishDataset, reference: Reference) => Promise<Dataset>;
  update: (datasetToUpdate: PublishDataset, dataset: Dataset) => Promise<Dataset>;
  addRessourceTo: (dataset: Dataset) => (ressource: PublishRessource) => Promise<void>;
  updateRessourceFor: (dataset: Dataset) => (ressource: PublishRessource, ressourceId?: string) => Promise<void>;
};

const addRessourceTo =
  (apiKey: string) =>
  (dataset: Dataset) =>
  async (ressource: PublishRessource): Promise<void> => {
    const formData: typeof FormData = new FormData();
    formData.append('file', fs.readFileSync(`${ressource.source}/${ressource.name}`), ressource.name);

    const ressourceId: string = (
      await axios.post<Ressource>(
        `${apiUrl()}/datasets/${dataset.id}/upload`,
        formData.getBuffer(),
        headers(formData.getHeaders(authHeader(apiKey)))
      )
    ).data.id;

    await axios.put<Ressource>(
      `${apiUrl()}/datasets/${dataset.id}/resources/${ressourceId}`,
      {
        schema: { name: ressource.schema },
        description: ressource.description
      },
      headers(authHeader(apiKey))
    );
  };

const updateRessourceFor =
  (apiKey: string) =>
  (dataset: Dataset) =>
  async (ressource: PublishRessource, ressourceId?: string): Promise<void> => {
    const formData: typeof FormData = new FormData();
    formData.append('file', fs.readFileSync(`${ressource.source}/${ressource.name}`), ressource.name);

    await axios.post<Ressource>(
      `${apiUrl()}/datasets/${dataset.id}/resources/${ressourceId}/upload`,
      formData.getBuffer(),
      headers(formData.getHeaders(authHeader(apiKey)))
    );

    await axios.put<Ressource>(
      `${apiUrl()}/datasets/${dataset.id}/resources/${ressourceId}`,
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
  addRessourceTo: addRessourceTo(apiKey),
  updateRessourceFor: updateRessourceFor(apiKey)
});
