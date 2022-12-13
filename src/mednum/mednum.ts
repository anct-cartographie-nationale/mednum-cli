import { PublishDatasetRepository, Ressource } from './repositories/publish-dataset.repository';

export type Frequency = 'daily';

export type Organization = {
  class: string;
  id: string;
  slug: string;
};

export type Dataset = {
  id: string;
  description: string;
  frequency: Frequency;
  title: string;
  organization?: Organization;
};

export type PostDataset = {
  description: string;
  frequency: Frequency;
  title: string;
  organization?: Organization;
};

type DatasetToPublishActions = {
  shouldCreate?: (datasetToCreate: PostDataset) => Promise<void>;
  exist?: (datasetToUpdate: PostDataset, datasetFound: Dataset) => Promise<void>;
};

const datasetFound = (dataset: Dataset | undefined): dataset is Dataset => dataset != null;

const matchTitleFrom =
  (postDataset: PostDataset) =>
  (dataset: Dataset): boolean =>
    dataset.title === postDataset.title;

const datasetToPublish =
  (datasetRepository: PublishDatasetRepository, ownerId: string) =>
  async (postDataset: PostDataset, { shouldCreate, exist }: DatasetToPublishActions): Promise<void> => {
    const dataset: Dataset | undefined = (await datasetRepository.get(ownerId)).find(matchTitleFrom(postDataset));
    await (datasetFound(dataset) ? exist?.(postDataset, dataset) : shouldCreate?.(postDataset));
  };

const updateExistingDataset =
  (datasetRepository: PublishDatasetRepository, ressources: Ressource[]) =>
  async (postDataset: PostDataset, dataset: Dataset): Promise<void> => {
    await datasetRepository.update(postDataset, dataset);
    ressources.length > 0 && (await Promise.all(ressources.map(datasetRepository.addRessourceTo(dataset))));
  };

const createNewDataset =
  (datasetRepository: PublishDatasetRepository, ressources: Ressource[]) =>
  async (postDataset: PostDataset): Promise<void> => {
    const dataset: Dataset = await datasetRepository.post(postDataset);
    ressources.length > 0 && (await Promise.all(ressources.map(datasetRepository.addRessourceTo(dataset))));
  };

export const publishDataset =
  (datasetRepository: PublishDatasetRepository, ownerId: string, ressources: Ressource[]) =>
  async (dataset: PostDataset): Promise<void> => {
    await datasetToPublish(datasetRepository, ownerId)(dataset, {
      exist: updateExistingDataset(datasetRepository, ressources),
      shouldCreate: createNewDataset(datasetRepository, ressources)
    });
  };
