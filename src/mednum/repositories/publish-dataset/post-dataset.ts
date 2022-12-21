/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import axios, { AxiosResponse } from 'axios';
import { Dataset, PublishDataset } from '../../mednum';
import { API_URL, authHeader, headers } from '../data-gouv.api';

type PostDatasetTransfer = {
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

const toCreateDatasetTransfer = (publishDataset: PublishDataset): PostDatasetTransfer => ({
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

export const postDataset =
  (apiKey: string) =>
  async (publishDataset: PublishDataset): Promise<Dataset> =>
    (
      await axios.post<Dataset, AxiosResponse<Dataset>, PostDatasetTransfer>(
        `${API_URL}/datasets`,
        toCreateDatasetTransfer(publishDataset),
        headers(authHeader(apiKey))
      )
    ).data;
