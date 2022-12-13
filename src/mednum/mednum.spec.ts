import { PostDataset, Dataset, publishDataset } from './mednum';
import { PublishDatasetRepository, PublishRessource } from './repositories/publish-dataset.repository';

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
  title: 'New Dataset',
  resources: []
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
  title: 'Existing Dataset',
  resources: []
};

const EXISTING_DATASET_WITH_CSV_RESOURCE: Dataset = {
  id: '6a564acf45cf645dfa5d4cd5',
  description: 'This is a dataset that have already been published',
  frequency: 'daily',
  title: 'Existing Dataset',
  resources: [
    {
      id: '15e10bf7-6d6a-44a1-9d70-176a44fc92a5',
      title: '20221213_maine-et-loire_lieux-de-mediation-numeriques-pays-de-la-loire.csv'
    }
  ]
};

const CSV_CREATE_RESSOURCE: PublishRessource = {
  source: 'assets/output/maine-et-loire/mediation-numerique',
  name: '20221213_maine-et-loire_lieux-de-mediation-numeriques-pays-de-la-loire.csv',
  schema: 'LaMednum/standard-mediation-num',
  description: 'Test ressource for a csv file'
};

const CSV_CREATE_RESSOURCE_AT_DIFFERENT_DATE: PublishRessource = {
  source: 'assets/output/maine-et-loire/mediation-numerique',
  name: '20230115_maine-et-loire_lieux-de-mediation-numeriques-pays-de-la-loire.csv',
  schema: 'LaMednum/standard-mediation-num',
  description: 'Test ressource for a csv file with a different date prefix in file name'
};

const CSV_CREATE_RESSOURCE_WITHOUT_UNDERSCORES: PublishRessource = {
  source: 'assets/output/maine-et-loire/mediation-numerique',
  name: '20221213-maine-et-loire-lieux-de-mediation-numeriques-pays-de-la-loire.csv',
  schema: 'LaMednum/standard-mediation-num',
  description: 'Test ressource for a csv file without underscores in file name'
};

const JSON_CREATE_RESSOURCE: PublishRessource = {
  source: 'assets/output/maine-et-loire/mediation-numerique',
  name: '20221213_maine-et-loire_lieux-de-mediation-numeriques-pays-de-la-loire.json',
  schema: 'LaMednum/standard-mediation-num',
  description: 'Test ressource for a json file'
};

const CSV_UPDATE_RESSOURCE: PublishRessource = {
  id: '15e10bf7-6d6a-44a1-9d70-176a44fc92a5',
  source: 'assets/output/maine-et-loire/mediation-numerique',
  name: '20221213_maine-et-loire_lieux-de-mediation-numeriques-pays-de-la-loire.csv',
  schema: 'LaMednum/standard-mediation-num',
  description: 'Test ressource for a csv file'
};

const CSV_UPDATE_RESSOURCE_AT_DIFFERENT_DATE: PublishRessource = {
  id: '15e10bf7-6d6a-44a1-9d70-176a44fc92a5',
  source: 'assets/output/maine-et-loire/mediation-numerique',
  name: '20230115_maine-et-loire_lieux-de-mediation-numeriques-pays-de-la-loire.csv',
  schema: 'LaMednum/standard-mediation-num',
  description: 'Test ressource for a csv file with a different date prefix in file name'
};

const CSV_UPDATE_RESSOURCE_WITHOUT_UNDERSCORES: PublishRessource = {
  id: '15e10bf7-6d6a-44a1-9d70-176a44fc92a5',
  source: 'assets/output/maine-et-loire/mediation-numerique',
  name: '20221213-maine-et-loire-lieux-de-mediation-numeriques-pays-de-la-loire.csv',
  schema: 'LaMednum/standard-mediation-num',
  description: 'Test ressource for a csv file without underscores in file name'
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
    const ressourcesToAdd: PublishRessource[] = [];

    const publishDatasetRepository: PublishDatasetRepository = {
      addRessourceTo:
        () =>
        (ressource: PublishRessource): void => {
          ressourcesToAdd.push(ressource);
        },
      get: (): Dataset[] => [],
      post: (): Dataset => DATASET_CREATED
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, OWNER_ID, [CSV_CREATE_RESSOURCE])(DATASET_TO_CREATE);

    expect(ressourcesToAdd).toStrictEqual([CSV_CREATE_RESSOURCE]);
  });

  it('should add ressources to updated dataset', async (): Promise<void> => {
    const ressourcesToAdd: PublishRessource[] = [];

    const publishDatasetRepository: PublishDatasetRepository = {
      addRessourceTo:
        () =>
        (ressource: PublishRessource): void => {
          ressourcesToAdd.push(ressource);
        },
      get: (): Dataset[] => [EXISTING_DATASET],
      update(_: PostDataset, dataset: Dataset): Dataset {
        return dataset;
      }
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, OWNER_ID, [CSV_CREATE_RESSOURCE])(DATASET_TO_UPDATE);

    expect(ressourcesToAdd).toStrictEqual([CSV_CREATE_RESSOURCE]);
  });

  it('should update existing csv ressource', async (): Promise<void> => {
    const ressourcesToAdd: PublishRessource[] = [];

    const publishDatasetRepository: PublishDatasetRepository = {
      addRessourceTo:
        () =>
        (ressource: PublishRessource): void => {
          ressourcesToAdd.push(ressource);
        },
      get: (): Dataset[] => [EXISTING_DATASET_WITH_CSV_RESOURCE],
      update(_: PostDataset, dataset: Dataset): Dataset {
        return dataset;
      }
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, OWNER_ID, [CSV_CREATE_RESSOURCE])(DATASET_TO_UPDATE);

    expect(ressourcesToAdd).toStrictEqual([CSV_UPDATE_RESSOURCE]);
  });

  it('should not update non existing json ressource', async (): Promise<void> => {
    const ressourcesToAdd: PublishRessource[] = [];

    const publishDatasetRepository: PublishDatasetRepository = {
      addRessourceTo:
        () =>
        (ressource: PublishRessource): void => {
          ressourcesToAdd.push(ressource);
        },
      get: (): Dataset[] => [EXISTING_DATASET_WITH_CSV_RESOURCE],
      update(_: PostDataset, dataset: Dataset): Dataset {
        return dataset;
      }
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, OWNER_ID, [JSON_CREATE_RESSOURCE])(DATASET_TO_UPDATE);

    expect(ressourcesToAdd).toStrictEqual([JSON_CREATE_RESSOURCE]);
  });

  it('should update existing csv ressource with different date', async (): Promise<void> => {
    const ressourcesToAdd: PublishRessource[] = [];

    const publishDatasetRepository: PublishDatasetRepository = {
      addRessourceTo:
        () =>
        (ressource: PublishRessource): void => {
          ressourcesToAdd.push(ressource);
        },
      get: (): Dataset[] => [EXISTING_DATASET_WITH_CSV_RESOURCE],
      update(_: PostDataset, dataset: Dataset): Dataset {
        return dataset;
      }
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, OWNER_ID, [CSV_CREATE_RESSOURCE_AT_DIFFERENT_DATE])(DATASET_TO_UPDATE);

    expect(ressourcesToAdd).toStrictEqual([CSV_UPDATE_RESSOURCE_AT_DIFFERENT_DATE]);
  });

  it('should update existing csv ressource with - instead of _', async (): Promise<void> => {
    const ressourcesToAdd: PublishRessource[] = [];

    const publishDatasetRepository: PublishDatasetRepository = {
      addRessourceTo:
        () =>
        (ressource: PublishRessource): void => {
          ressourcesToAdd.push(ressource);
        },
      get: (): Dataset[] => [EXISTING_DATASET_WITH_CSV_RESOURCE],
      update(_: PostDataset, dataset: Dataset): Dataset {
        return dataset;
      }
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, OWNER_ID, [CSV_CREATE_RESSOURCE_WITHOUT_UNDERSCORES])(DATASET_TO_UPDATE);

    expect(ressourcesToAdd).toStrictEqual([CSV_UPDATE_RESSOURCE_WITHOUT_UNDERSCORES]);
  });
});
