import type { Dataset } from './dataset';
import type { DatasetRepository } from './dataset-repository';
import type { PublishDataset } from './publish-dataset';
import type { PublishRessource } from './publish-ressource';
import type { Reference } from './reference';
import type { Ressource } from './ressource';

type DatasetToPublishActions = {
  shouldCreate?: (datasetToCreate: PublishDataset) => Promise<void>;
  exist?: (datasetToUpdate: PublishDataset, datasetFound: Dataset) => Promise<void>;
};

const DATE_FORMAT_CHECK: RegExp = /\d{8}|(\d{4})-(\d{2})-(\d{2})/g;

const datasetFound = (dataset: Dataset | undefined): dataset is Dataset => dataset != null;

const matchTitleFrom =
  (postDataset: PublishDataset) =>
  (dataset: Dataset): boolean =>
    dataset.title === postDataset.title;

const datasetToPublish =
  (datasetRepository: DatasetRepository, reference: Reference) =>
  async (postDataset: PublishDataset, { shouldCreate, exist }: DatasetToPublishActions): Promise<void> => {
    const dataset: Dataset | undefined = (await datasetRepository.get(reference)).find(matchTitleFrom(postDataset));
    await (datasetFound(dataset) ? exist?.(postDataset, dataset) : shouldCreate?.(postDataset));
  };

const removeDate = (title?: string): string | undefined => title?.replace(DATE_FORMAT_CHECK, '');

const extractNameFromPath = (splitPath: string[]): string | undefined => splitPath[splitPath.length - 1];

const matchName =
  (ressource: PublishRessource) =>
  (existingRessource: Ressource): boolean =>
    removeDate(existingRessource.name) === removeDate(extractNameFromPath(ressource.source.split('/')));

const toRessourceToUpload =
  (dataset: Dataset, datasetRepository: DatasetRepository) =>
  async (ressourceToPublish: PublishRessource): Promise<void> =>
    datasetRepository.updateRessourceFor(dataset)(
      ressourceToPublish,
      dataset.ressources.find(matchName(ressourceToPublish))?.id
    );

const updateExistingDataset =
  (datasetRepository: DatasetRepository) =>
  async (postDataset: PublishDataset, dataset: Dataset): Promise<void> => {
    await datasetRepository.update(postDataset, dataset);
    if (postDataset.ressources.length > 0) {
      await Promise.all(postDataset.ressources.map(toRessourceToUpload(dataset, datasetRepository)));
    }
  };

const createNewDataset =
  (datasetRepository: DatasetRepository, reference: Reference) =>
  async (postDataset: PublishDataset): Promise<void> => {
    const dataset: Dataset = await datasetRepository.post(postDataset, reference);
    if (postDataset.ressources.length > 0) {
      await Promise.all(postDataset.ressources.map(datasetRepository.addRessourceTo(dataset)));
    }
  };

export const publishDataset =
  (datasetRepository: DatasetRepository, reference: Reference) =>
  async (dataset: PublishDataset): Promise<void> => {
    await datasetToPublish(datasetRepository, reference)(dataset, {
      exist: updateExistingDataset(datasetRepository),
      shouldCreate: createNewDataset(datasetRepository, reference)
    });
  };
