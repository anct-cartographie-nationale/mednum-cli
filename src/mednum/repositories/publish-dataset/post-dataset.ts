/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import axios, { AxiosResponse } from 'axios';
import { Dataset, PublishDataset, Reference } from '../../mednum';
import { apiUrl, authHeader, headers } from '../data-gouv.api';

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

const toCreateDatasetTransfer = (publishDataset: PublishDataset, reference: Reference): PostDatasetTransfer => ({
  description: publishDataset.description,
  frequency: publishDataset.frequency,
  title: publishDataset.title,
  license: publishDataset.license,
  ...(reference.isOwner ? {} : { organization: { id: reference.id } }),
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
  async (publishDataset: PublishDataset, reference: Reference): Promise<Dataset> =>
    (
      await axios.post<Dataset, AxiosResponse<Dataset>, PostDatasetTransfer>(
        `${apiUrl()}/datasets`,
        toCreateDatasetTransfer(publishDataset, reference),
        headers(authHeader(apiKey))
      )
    ).data;
