import { Dataset, PublishDataset, PublishRessource, Reference, Ressource } from '../models';
import axios from 'axios';
/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import * as fs from 'fs';
/* eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/naming-convention, @typescript-eslint/typedef, @typescript-eslint/no-shadow, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const FormData = require('form-data');
import { getDataset, postDataset, updateDataset } from './publish-dataset';
import { Api, authHeader, headers } from './data-gouv.api';

export type PublishDatasetRepository = {
  get: (reference: Reference) => Promise<Dataset[]>;
  post: (datasetToCreate: PublishDataset, reference: Reference) => Promise<Dataset>;
  update: (datasetToUpdate: PublishDataset, dataset: Dataset) => Promise<Dataset>;
  addRessourceTo: (dataset: Dataset) => (ressource: PublishRessource) => Promise<void>;
  updateRessourceFor: (dataset: Dataset) => (ressource: PublishRessource, ressourceId?: string) => Promise<void>;
};

const extractNameFromPath = (splitPath: string[]): string | undefined => splitPath[splitPath.length - 1];

const addRessourceTo =
  (api: Api) =>
  (dataset: Dataset) =>
  async (ressource: PublishRessource): Promise<void> => {
    const formData: typeof FormData = new FormData();
    formData.append('file', fs.readFileSync(`${ressource.source}`), extractNameFromPath(ressource.source.split('/')));

    const ressourceId: string = (
      await axios.post<Ressource>(
        `${api.url}/datasets/${dataset.id}/upload`,
        formData.getBuffer(),
        headers(formData.getHeaders(authHeader(api.key)))
      )
    ).data.id;

    await axios.put<Ressource>(
      `${api.url}/datasets/${dataset.id}/resources/${ressourceId}`,
      {
        schema: { name: ressource.schema },
        description: ressource.description
      },
      headers(authHeader(api.key))
    );
  };

const updateRessourceFor =
  (api: Api) =>
  (dataset: Dataset) =>
  async (ressource: PublishRessource, ressourceId?: string): Promise<void> => {
    const formData: typeof FormData = new FormData();
    formData.append('file', fs.readFileSync(`${ressource.source}`), extractNameFromPath(ressource.source.split('/')));

    await axios.post<Ressource>(
      `${api.url}/datasets/${dataset.id}/resources/${ressourceId}/upload`,
      formData.getBuffer(),
      headers(formData.getHeaders(authHeader(api.key)))
    );

    await axios.put<Ressource>(
      `${api.url}/datasets/${dataset.id}/resources/${ressourceId}`,
      {
        schema: { name: ressource.schema },
        description: ressource.description
      },
      headers(authHeader(api.key))
    );
  };

export const publishDatasetRepository = (api: Api): PublishDatasetRepository => ({
  get: getDataset(api),
  post: postDataset(api),
  update: updateDataset(api),
  addRessourceTo: addRessourceTo(api),
  updateRessourceFor: updateRessourceFor(api)
});
