/* eslint-disable @typescript-eslint/naming-convention */

import axios from 'axios';
import { Api, headers } from '../../../common';
import { Dataset, Reference, Ressource } from '../../models';

type GetDatasetRessource = {
  created_at: Date;
  description: string;
  filesize: number;
  filetype: string;
  format: string;
  id: string;
  last_modified: Date;
  mime: string;
  published: Date;
  schema: { name: string };
  title: string;
  type: string;
};

type GetDataset = {
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
  resources: GetDatasetRessource[];
};

const toRessource = (getDatasetRessource: GetDatasetRessource): Ressource => ({
  description: getDatasetRessource.description,
  id: getDatasetRessource.id,
  name: getDatasetRessource.title,
  schema: getDatasetRessource.schema.name
});

const toDataset = (getDatasetTransfer: GetDataset): Dataset => ({
  description: getDatasetTransfer.description,
  frequency: getDatasetTransfer.frequency,
  id: getDatasetTransfer.id,
  ressources: getDatasetTransfer.resources.map(toRessource),
  title: getDatasetTransfer.title
});

const idQueryParams = (reference: Reference): string =>
  reference.isOwner ? `?owner=${reference.id}&page_size=10000` : `?organization=${reference.id}`;

export const getDataset =
  (api: Api) =>
  async (reference: Reference): Promise<Dataset[]> =>
    (await axios.get(`${api.url}/datasets/${idQueryParams(reference)}&page_size=10000`, headers())).data.data.map(toDataset);
