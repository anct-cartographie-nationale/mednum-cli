import axios, { AxiosResponse } from 'axios';
import { Api, authHeader, headers } from '../../../common';
import { Dataset, PublishDataset, Reference } from '../../models';

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
  (api: Api) =>
  async (publishDataset: PublishDataset, reference: Reference): Promise<Dataset> =>
    (
      await axios.post<Dataset, AxiosResponse<Dataset>, PostDatasetTransfer>(
        `${api.url}/datasets`,
        toCreateDatasetTransfer(publishDataset, reference),
        headers(authHeader(api.key))
      )
    ).data;
