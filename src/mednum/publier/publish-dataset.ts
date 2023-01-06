import { Dataset, PublishDataset, PublishRessource, Reference, Ressource } from './models';
import { PublishDatasetRepository } from './repositories';

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
  (datasetRepository: PublishDatasetRepository, reference: Reference) =>
  async (postDataset: PublishDataset, { shouldCreate, exist }: DatasetToPublishActions): Promise<void> => {
    const dataset: Dataset | undefined = (await datasetRepository.get(reference)).find(matchTitleFrom(postDataset));
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
  (datasetRepository: PublishDatasetRepository, reference: Reference) =>
  async (postDataset: PublishDataset): Promise<void> => {
    const dataset: Dataset = await datasetRepository.post(postDataset, reference);
    postDataset.ressources.length > 0 &&
      (await Promise.all(postDataset.ressources.map(datasetRepository.addRessourceTo(dataset))));
  };

export const publishDataset =
  (datasetRepository: PublishDatasetRepository, reference: Reference) =>
  async (dataset: PublishDataset): Promise<void> => {
    await datasetToPublish(datasetRepository, reference)(dataset, {
      exist: updateExistingDataset(datasetRepository),
      shouldCreate: createNewDataset(datasetRepository, reference)
    });
  };
