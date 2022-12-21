/* eslint-disable @typescript-eslint/naming-convention */

import axios from 'axios';
import { Dataset, Ressource } from '../../mednum';
import { API_URL, headers } from '../data-gouv.api';

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
  resources: getDatasetTransfer.resources.map(toRessource),
  title: getDatasetTransfer.title
});

export const getDataset = async (ownerId: string): Promise<Dataset[]> =>
  (
    await axios
      // todo: switch between owner and organization
      // .get(`${API_URL}/datasets/?organization=${organization.id}`)
      .get(`${API_URL}/datasets/?owner=${ownerId}&page_size=10000`, headers())
  ).data.data.map(toDataset);
