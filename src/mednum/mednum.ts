import { PublishDatasetRepository, PublishRessource } from './repositories/publish-dataset.repository';

export type Frequency = 'daily';

export type Organization = {
  class: string;
  id: string;
  slug: string;
};

export type Ressource = {
  id: string;
  title: string;
};

export type Dataset = {
  id: string;
  description: string;
  frequency: Frequency;
  title: string;
  organization?: Organization;
  resources: Ressource[];
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

const idIfAny = (id?: string): { id?: string } => (id == null ? {} : { id });

const removeDatePrefix = (title: string): string => title.substring(8);

const matchName =
  (ressource: PublishRessource) =>
  (existingRessource: Ressource): boolean =>
    removeDatePrefix(existingRessource.title).replace(/_/gu, '-') === removeDatePrefix(ressource.name).replace(/_/gu, '-');

const toRessourceToUpload =
  (dataset: Dataset, datasetRepository: PublishDatasetRepository) =>
  async (ressourceToPublish: PublishRessource): Promise<void> =>
    datasetRepository.addRessourceTo(dataset)({
      ...idIfAny(dataset.resources.find(matchName(ressourceToPublish))?.id),
      ...ressourceToPublish
    });

const updateExistingDataset =
  (datasetRepository: PublishDatasetRepository, ressources: PublishRessource[]) =>
  async (postDataset: PostDataset, dataset: Dataset): Promise<void> => {
    await datasetRepository.update(postDataset, dataset);
    ressources.length > 0 && (await Promise.all(ressources.map(toRessourceToUpload(dataset, datasetRepository))));
  };

const createNewDataset =
  (datasetRepository: PublishDatasetRepository, ressources: PublishRessource[]) =>
  async (postDataset: PostDataset): Promise<void> => {
    const dataset: Dataset = await datasetRepository.post(postDataset);
    ressources.length > 0 && (await Promise.all(ressources.map(datasetRepository.addRessourceTo(dataset))));
  };

export const publishDataset =
  (datasetRepository: PublishDatasetRepository, ownerId: string, ressources: PublishRessource[]) =>
  async (dataset: PostDataset): Promise<void> => {
    await datasetToPublish(datasetRepository, ownerId)(dataset, {
      exist: updateExistingDataset(datasetRepository, ressources),
      shouldCreate: createNewDataset(datasetRepository, ressources)
    });
  };
