import { PublishDataset, Dataset, publishDataset, PublishRessource, Ressource } from './mednum';
import { PublishDatasetRepository } from './repositories/publish-dataset.repository';

const OWNER_ID: string = 'cdf56af1aa1f5c6';

const DATASET_TO_CREATE: PublishDataset = {
  description: 'This is a dataset to publish',
  frequency: 'daily',
  title: 'New Dataset',
  ressources: []
} as unknown as PublishDataset;

const CSV_CREATE_RESSOURCE: PublishRessource = {
  source: 'assets/output/maine-et-loire/mediation-numerique',
  name: '20221213_maine-et-loire_lieux-de-mediation-numeriques-pays-de-la-loire.csv',
  schema: 'LaMednum/standard-mediation-num',
  description: 'Test ressource for a csv file'
};

const DATASET_TO_CREATE_WITH_CREATE_CSV_RESSOURCE: PublishDataset = {
  description: 'This is a dataset to publish',
  frequency: 'daily',
  title: 'New Dataset',
  ressources: [CSV_CREATE_RESSOURCE]
} as PublishDataset;

const DATASET_TO_CREATE_WITHOUT_RESSOURCES: PublishDataset = {
  description: 'This is a dataset to publish',
  frequency: 'daily',
  title: 'New Dataset',
  ressources: []
} as unknown as PublishDataset;

const DATASET_CREATED: Dataset = {
  id: '6a564acf45cf645dfa5d4cd5',
  description: 'This is a dataset to publish',
  frequency: 'daily',
  title: 'New Dataset',
  resources: []
};

const DATASET_TO_UPDATE: PublishDataset = {
  description: 'This is a dataset to publish',
  frequency: 'daily',
  title: 'Existing Dataset',
  ressources: []
} as unknown as PublishDataset;

const CSV_CREATE_RESSOURCE_WITHOUT_UNDERSCORES: PublishRessource = {
  source: 'assets/output/maine-et-loire/mediation-numerique',
  name: '20221213-maine-et-loire-lieux-de-mediation-numeriques-pays-de-la-loire.csv',
  schema: 'LaMednum/standard-mediation-num',
  description: 'Test ressource for a csv file without underscores in file name'
};

const DATASET_TO_UPDATE_WITH_CREATE_CSV_RESSOURCE_WITHOUT_UNDERSCORES: PublishDataset = {
  description: 'This is a dataset to publish',
  frequency: 'daily',
  title: 'Existing Dataset',
  ressources: [CSV_CREATE_RESSOURCE_WITHOUT_UNDERSCORES]
} as PublishDataset;

const CSV_CREATE_RESSOURCE_AT_DIFFERENT_DATE: PublishRessource = {
  source: 'assets/output/maine-et-loire/mediation-numerique',
  name: '20230115_maine-et-loire_lieux-de-mediation-numeriques-pays-de-la-loire.csv',
  schema: 'LaMednum/standard-mediation-num',
  description: 'Test ressource for a csv file with a different date prefix in file name'
};

const DATASET_TO_UPDATE_WITH_CREATE_CSV_RESSOURCE_AT_DIFFERENT_DATE: PublishDataset = {
  description: 'This is a dataset to publish',
  frequency: 'daily',
  title: 'Existing Dataset',
  ressources: [CSV_CREATE_RESSOURCE_AT_DIFFERENT_DATE]
} as PublishDataset;

const DATASET_TO_UPDATE_WITHOUT_RESSOURCES: PublishDataset = {
  description: 'This is a dataset to publish',
  frequency: 'daily',
  title: 'Existing Dataset',
  ressources: []
} as unknown as PublishDataset;

const DATASET_TO_UPDATE_WITH_CREATE_CSV_RESSOURCE: PublishDataset = {
  description: 'This is a dataset to publish',
  frequency: 'daily',
  title: 'Existing Dataset',
  ressources: [CSV_CREATE_RESSOURCE]
} as PublishDataset;

const JSON_CREATE_RESSOURCE: PublishRessource = {
  source: 'assets/output/maine-et-loire/mediation-numerique',
  name: '20221213_maine-et-loire_lieux-de-mediation-numeriques-pays-de-la-loire.json',
  schema: 'LaMednum/standard-mediation-num',
  description: 'Test ressource for a json file'
};

const DATASET_TO_UPDATE_WITH_CREATE_JSON_RESSOURCE: PublishDataset = {
  description: 'This is a dataset to publish',
  frequency: 'daily',
  title: 'Existing Dataset',
  ressources: [JSON_CREATE_RESSOURCE]
} as PublishDataset;

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
      name: '20221213_maine-et-loire_lieux-de-mediation-numeriques-pays-de-la-loire.csv'
    }
  ]
};

const CSV_UPDATE_RESSOURCE: PublishRessource = {
  source: 'assets/output/maine-et-loire/mediation-numerique',
  name: '20221213_maine-et-loire_lieux-de-mediation-numeriques-pays-de-la-loire.csv',
  schema: 'LaMednum/standard-mediation-num',
  description: 'Test ressource for a csv file'
};

const CSV_UPDATE_RESSOURCE_AT_DIFFERENT_DATE: PublishRessource = {
  source: 'assets/output/maine-et-loire/mediation-numerique',
  name: '20230115_maine-et-loire_lieux-de-mediation-numeriques-pays-de-la-loire.csv',
  schema: 'LaMednum/standard-mediation-num',
  description: 'Test ressource for a csv file with a different date prefix in file name'
};

const CSV_UPDATE_RESSOURCE_WITHOUT_UNDERSCORES: PublishRessource = {
  source: 'assets/output/maine-et-loire/mediation-numerique',
  name: '20221213-maine-et-loire-lieux-de-mediation-numeriques-pays-de-la-loire.csv',
  schema: 'LaMednum/standard-mediation-num',
  description: 'Test ressource for a csv file without underscores in file name'
};

describe('mednum - dataset to update', (): void => {
  it('should find that there is no dataset to update since there is no existing dataset with this title', async (): Promise<void> => {
    const datasetsToCreate: PublishDataset[] = [];

    const publishDatasetRepository: PublishDatasetRepository = {
      get: (): Dataset[] => [],
      post: (datasetToCreate: PublishDataset): Dataset => {
        datasetsToCreate.push(datasetToCreate);
        return DATASET_CREATED;
      }
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, OWNER_ID)(DATASET_TO_CREATE_WITHOUT_RESSOURCES);

    expect(datasetsToCreate).toStrictEqual([DATASET_TO_CREATE]);
  });

  it('should find an already published dataset to update with the same title', async (): Promise<void> => {
    const datasetsToUpdate: PublishDataset[] = [];

    const publishDatasetRepository: PublishDatasetRepository = {
      get: (): Dataset[] => [EXISTING_DATASET],
      update: (datasetToUpdate: PublishDataset, dataset: Dataset): Dataset => {
        datasetsToUpdate.push(datasetToUpdate);
        return dataset;
      }
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, OWNER_ID)(DATASET_TO_UPDATE_WITHOUT_RESSOURCES);

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

    await publishDataset(publishDatasetRepository, OWNER_ID)(DATASET_TO_CREATE_WITH_CREATE_CSV_RESSOURCE);

    expect(ressourcesToAdd).toStrictEqual([CSV_CREATE_RESSOURCE]);
  });

  it('should add ressources to updated dataset', async (): Promise<void> => {
    const ressourcesToAdd: PublishRessource[] = [];

    const publishDatasetRepository: PublishDatasetRepository = {
      updateRessourceFor:
        () =>
        (ressource: PublishRessource): void => {
          ressourcesToAdd.push(ressource);
        },
      get: (): Dataset[] => [EXISTING_DATASET],
      update(_: PublishDataset, dataset: Dataset): Dataset {
        return dataset;
      }
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, OWNER_ID)(DATASET_TO_UPDATE_WITH_CREATE_CSV_RESSOURCE);

    expect(ressourcesToAdd).toStrictEqual([CSV_CREATE_RESSOURCE]);
  });

  it('should update existing csv ressource', async (): Promise<void> => {
    const ressourcesToAdd: PublishRessource[] = [];

    const publishDatasetRepository: PublishDatasetRepository = {
      updateRessourceFor:
        () =>
        (ressource: PublishRessource): void => {
          ressourcesToAdd.push(ressource);
        },
      get: (): Dataset[] => [EXISTING_DATASET_WITH_CSV_RESOURCE],
      update(_: PublishDataset, dataset: Dataset): Dataset {
        return dataset;
      }
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, OWNER_ID)(DATASET_TO_UPDATE_WITH_CREATE_CSV_RESSOURCE);

    expect(ressourcesToAdd).toStrictEqual([CSV_UPDATE_RESSOURCE]);
  });

  it('should not update non existing json ressource', async (): Promise<void> => {
    const ressourcesToAdd: PublishRessource[] = [];

    const publishDatasetRepository: PublishDatasetRepository = {
      updateRessourceFor:
        () =>
        (ressource: PublishRessource): void => {
          ressourcesToAdd.push(ressource);
        },
      get: (): Dataset[] => [EXISTING_DATASET_WITH_CSV_RESOURCE],
      update(_: PublishDataset, dataset: Dataset): Dataset {
        return dataset;
      }
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, OWNER_ID)(DATASET_TO_UPDATE_WITH_CREATE_JSON_RESSOURCE);

    expect(ressourcesToAdd).toStrictEqual([JSON_CREATE_RESSOURCE]);
  });

  it('should update existing csv ressource with different date', async (): Promise<void> => {
    const ressourcesToAdd: PublishRessource[] = [];

    const publishDatasetRepository: PublishDatasetRepository = {
      updateRessourceFor:
        () =>
        (ressource: PublishRessource): void => {
          ressourcesToAdd.push(ressource);
        },
      get: (): Dataset[] => [EXISTING_DATASET_WITH_CSV_RESOURCE],
      update(_: PublishDataset, dataset: Dataset): Dataset {
        return dataset;
      }
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, OWNER_ID)(DATASET_TO_UPDATE_WITH_CREATE_CSV_RESSOURCE_AT_DIFFERENT_DATE);

    expect(ressourcesToAdd).toStrictEqual([CSV_UPDATE_RESSOURCE_AT_DIFFERENT_DATE]);
  });

  it('should update existing csv ressource with - instead of _', async (): Promise<void> => {
    const ressourcesToAdd: PublishRessource[] = [];

    const publishDatasetRepository: PublishDatasetRepository = {
      updateRessourceFor:
        () =>
        (ressource: PublishRessource): void => {
          ressourcesToAdd.push(ressource);
        },
      get: (): Dataset[] => [EXISTING_DATASET_WITH_CSV_RESOURCE],
      update(_: PublishDataset, dataset: Dataset): Dataset {
        return dataset;
      }
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, OWNER_ID)(DATASET_TO_UPDATE_WITH_CREATE_CSV_RESSOURCE_WITHOUT_UNDERSCORES);

    expect(ressourcesToAdd).toStrictEqual([CSV_UPDATE_RESSOURCE_WITHOUT_UNDERSCORES]);
  });
});
