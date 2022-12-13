import { PostDataset, Dataset, publishDataset } from './mednum';
import { PublishDatasetRepository, Ressource } from './repositories/publish-dataset.repository';

const OWNER_ID: string = 'cdf56af1aa1f5c6';

const DATASET_TO_CREATE: PostDataset = {
  description: 'This is a dataset to publish',
  frequency: 'daily',
  title: 'New Dataset'
};

const DATASET_CREATED: Dataset = {
  id: '6a564acf45cf645dfa5d4cd5',
  description: 'This is a dataset to publish',
  frequency: 'daily',
  title: 'New Dataset'
};

const DATASET_TO_UPDATE: PostDataset = {
  description: 'This is a dataset to publish',
  frequency: 'daily',
  title: 'Existing Dataset'
};

const EXISTING_DATASET: Dataset = {
  id: '6a564acf45cf645dfa5d4cd5',
  description: 'This is a dataset that have already been published',
  frequency: 'daily',
  title: 'Existing Dataset'
};

const RESSOURCE: Ressource = {
  source: 'path',
  name: 'test.csv'
};

describe('mednum - dataset to update', (): void => {
  it('should find that there is no dataset to update since there is no existing dataset with this title', async (): Promise<void> => {
    const datasetsToCreate: PostDataset[] = [];

    const publishDatasetRepository: PublishDatasetRepository = {
      get: (): Dataset[] => [],
      post: (datasetToCreate: PostDataset): Dataset => {
        datasetsToCreate.push(datasetToCreate);
        return DATASET_CREATED;
      }
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, OWNER_ID, [])(DATASET_TO_CREATE);

    expect(datasetsToCreate).toStrictEqual([DATASET_TO_CREATE]);
  });

  it('should find an already published dataset to update with the same title', async (): Promise<void> => {
    const datasetsToUpdate: PostDataset[] = [];

    const publishDatasetRepository: PublishDatasetRepository = {
      get: (): Dataset[] => [EXISTING_DATASET],
      update: (datasetToUpdate: PostDataset, dataset: Dataset): Dataset => {
        datasetsToUpdate.push(datasetToUpdate);
        return dataset;
      }
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, OWNER_ID, [])(DATASET_TO_UPDATE);

    expect(datasetsToUpdate).toStrictEqual([DATASET_TO_UPDATE]);
  });

  it('should add ressources to new published dataset', async (): Promise<void> => {
    const ressourcesToAdd: Ressource[] = [];

    const publishDatasetRepository: PublishDatasetRepository = {
      addRessourceTo:
        () =>
        (ressource: Ressource): void => {
          ressourcesToAdd.push(ressource);
        },
      get: (): Dataset[] => [],
      post: (): Dataset => DATASET_CREATED
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, OWNER_ID, [RESSOURCE])(DATASET_TO_CREATE);

    expect(ressourcesToAdd).toStrictEqual([RESSOURCE]);
  });

  it('should add ressources to updated dataset', async (): Promise<void> => {
    const ressourcesToAdd: Ressource[] = [];

    const publishDatasetRepository: PublishDatasetRepository = {
      addRessourceTo:
        () =>
        (ressource: Ressource): void => {
          ressourcesToAdd.push(ressource);
        },
      get: (): Dataset[] => [EXISTING_DATASET],
      update(_: PostDataset, dataset: Dataset): Dataset {
        return dataset;
      }
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, OWNER_ID, [RESSOURCE])(DATASET_TO_UPDATE);

    expect(ressourcesToAdd).toStrictEqual([RESSOURCE]);
  });
});
