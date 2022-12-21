import { PublishDatasetRepository } from './repositories/publish-dataset.repository';

export type Organization = {
  class: string;
  id: string;
  slug: string;
};

export type Ressource = {
  id: string;
  name: string;
  schema?: string;
  description?: string;
};

export type PublishRessource = {
  name: string;
  source: string;
  schema: string;
  description: string;
};

export type Dataset = {
  id: string;
  description: string;
  frequency: string;
  title: string;
  organization?: Organization;
  resources: Ressource[];
};

export type PublishDataset = {
  description: string;
  frequency: string;
  title: string;
  organization?: Organization;
  tags: string[];
  license: string;
  zone: string;
  granularity: string;
  start: string;
  end: string;
  ressources: PublishRessource[];
};

type DatasetToPublishActions = {
  shouldCreate?: (datasetToCreate: PublishDataset) => Promise<void>;
  exist?: (datasetToUpdate: PublishDataset, datasetFound: Dataset) => Promise<void>;
};

const datasetFound = (dataset: Dataset | undefined): dataset is Dataset => dataset != null;

const matchTitleFrom =
  (postDataset: PublishDataset) =>
  (dataset: Dataset): boolean =>
    dataset.title === postDataset.title;

const datasetToPublish =
  (datasetRepository: PublishDatasetRepository, ownerId: string) =>
  async (postDataset: PublishDataset, { shouldCreate, exist }: DatasetToPublishActions): Promise<void> => {
    const dataset: Dataset | undefined = (await datasetRepository.get(ownerId)).find(matchTitleFrom(postDataset));
    await (datasetFound(dataset) ? exist?.(postDataset, dataset) : shouldCreate?.(postDataset));
  };

const removeDatePrefix = (title: string): string => title.substring(8);

const matchName =
  (ressource: PublishRessource) =>
  (existingRessource: Ressource): boolean =>
    removeDatePrefix(existingRessource.name).replace(/_/gu, '-') === removeDatePrefix(ressource.name).replace(/_/gu, '-');

const toRessourceToUpload =
  (dataset: Dataset, datasetRepository: PublishDatasetRepository) =>
  async (ressourceToPublish: PublishRessource): Promise<void> =>
    datasetRepository.updateRessourceFor(dataset)(
      ressourceToPublish,
      dataset.resources.find(matchName(ressourceToPublish))?.id
    );

const updateExistingDataset =
  (datasetRepository: PublishDatasetRepository) =>
  async (postDataset: PublishDataset, dataset: Dataset): Promise<void> => {
    await datasetRepository.update(postDataset, dataset);
    postDataset.ressources.length > 0 &&
      (await Promise.all(postDataset.ressources.map(toRessourceToUpload(dataset, datasetRepository))));
  };

const createNewDataset =
  (datasetRepository: PublishDatasetRepository) =>
  async (postDataset: PublishDataset): Promise<void> => {
    const dataset: Dataset = await datasetRepository.post(postDataset);
    postDataset.ressources.length > 0 &&
      (await Promise.all(postDataset.ressources.map(datasetRepository.addRessourceTo(dataset))));
  };

export const publishDataset =
  (datasetRepository: PublishDatasetRepository, ownerId: string) =>
  async (dataset: PublishDataset): Promise<void> => {
    await datasetToPublish(datasetRepository, ownerId)(dataset, {
      exist: updateExistingDataset(datasetRepository),
      shouldCreate: createNewDataset(datasetRepository)
    });
  };
