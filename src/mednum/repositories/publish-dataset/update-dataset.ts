/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import axios, { AxiosResponse } from 'axios';
import { Dataset, PublishDataset } from '../../mednum';
import { API_URL, authHeader, headers } from '../data-gouv.api';

type UpdateDatasetTransfer = {
  description: string;
  frequency: string;
  title: string;
  license: string;
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

const toUpdateDatasetTransfer = (publishDataset: PublishDataset): UpdateDatasetTransfer => ({
  description: publishDataset.description,
  frequency: publishDataset.frequency,
  title: publishDataset.title,
  license: publishDataset.license,
  tags: publishDataset.tags.join(', '),
  spatial: {
    zones: publishDataset.zone,
    granularity: publishDataset.granularity
  },
  temporal_coverage: {
    start: publishDataset.start,
    end: publishDataset.end
  }
});

export const updateDataset =
  (apiKey: string) =>
  async (publishDataset: PublishDataset, dataset: Dataset): Promise<Dataset> =>
    (
      await axios.put<Dataset, AxiosResponse<Dataset>, UpdateDatasetTransfer>(
        `${API_URL}/datasets/${dataset.id}`,
        toUpdateDatasetTransfer(publishDataset),
        headers(authHeader(apiKey))
      )
    ).data;
