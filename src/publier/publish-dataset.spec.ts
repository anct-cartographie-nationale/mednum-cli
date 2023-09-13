import { publishDataset } from './publish-dataset';
import { PublishDatasetRepository } from './repositories';
import { Dataset, PublishDataset, PublishRessource } from './models';

describe('mednum - dataset to update', (): void => {
  it('should create new dataset without ressources', async (): Promise<void> => {
    const expectedDatasets: Dataset[] = [];

    const publishDatasetRepository: PublishDatasetRepository = {
      get: (): Dataset[] => [],
      post: (datasetToCreate: PublishDataset): Dataset => {
        const dataset: Dataset = {
          description: datasetToCreate.description,
          frequency: datasetToCreate.frequency,
          id: '6a564acf45cf645dfa5d4cd5',
          ressources: [],
          title: datasetToCreate.title
        };

        expectedDatasets.push(dataset);

        return dataset;
      }
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, { id: '', isOwner: false })({
      description: 'Lieux de médiation numérique au standard de la Mednum',
      frequency: 'daily',
      title: 'Lieux de médiation numérique',
      tags: ['inclusion'],
      license: 'lov2',
      zone: 'fr:region:84',
      granularity: 'poi',
      start: '2021-09-03',
      end: '2023-01-04',
      ressources: []
    });

    expect(expectedDatasets).toStrictEqual([
      {
        id: '6a564acf45cf645dfa5d4cd5',
        description: 'Lieux de médiation numérique au standard de la Mednum',
        frequency: 'daily',
        title: 'Lieux de médiation numérique',
        ressources: []
      }
    ]);
  });

  it('should create new dataset without ressources when existing dataset with different name', async (): Promise<void> => {
    const expectedDatasets: Dataset[] = [
      {
        id: '6aacf16451afc56441ac64a6',
        description: 'Lieux de médiation numérique au standard de la Mednum',
        frequency: 'daily',
        title: 'Already existing dataset',
        ressources: []
      }
    ];

    const publishDatasetRepository: PublishDatasetRepository = {
      get: (): Dataset[] => [
        {
          id: '6aacf16451afc56441ac64a6',
          description: 'Lieux de médiation numérique au standard de la Mednum',
          frequency: 'daily',
          title: 'Already existing dataset',
          ressources: []
        }
      ],
      post: (datasetToCreate: PublishDataset): Dataset => {
        const dataset: Dataset = {
          description: datasetToCreate.description,
          frequency: datasetToCreate.frequency,
          id: '6a564acf45cf645dfa5d4cd5',
          ressources: [],
          title: datasetToCreate.title
        };

        expectedDatasets.push(dataset);

        return dataset;
      }
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, { id: '', isOwner: false })({
      description: 'Lieux de médiation numérique au standard de la Mednum',
      frequency: 'daily',
      title: 'Lieux de médiation numérique',
      tags: ['inclusion'],
      license: 'lov2',
      zone: 'fr:region:84',
      granularity: 'poi',
      start: '2021-09-03',
      end: '2023-01-04',
      ressources: []
    });

    expect(expectedDatasets).toStrictEqual([
      {
        id: '6aacf16451afc56441ac64a6',
        description: 'Lieux de médiation numérique au standard de la Mednum',
        frequency: 'daily',
        title: 'Already existing dataset',
        ressources: []
      },
      {
        id: '6a564acf45cf645dfa5d4cd5',
        description: 'Lieux de médiation numérique au standard de la Mednum',
        frequency: 'daily',
        title: 'Lieux de médiation numérique',
        ressources: []
      }
    ]);
  });

  it('should create new dataset with ressources', async (): Promise<void> => {
    const expectedDatasets: Dataset[] = [];

    const publishDatasetRepository: PublishDatasetRepository = {
      get: (): Dataset[] => [],
      post: (datasetToCreate: PublishDataset): Dataset => {
        const dataset: Dataset = {
          description: datasetToCreate.description,
          frequency: datasetToCreate.frequency,
          id: '6a564acf45cf645dfa5d4cd5',
          ressources: [
            {
              id: '15e10bf7-6d6a-44a1-9d70-176a44fc92a5',
              name: 'services-inclusion-20230107_le-hub-hinaura.json',
              schema: datasetToCreate.ressources[0]?.schema ?? '',
              description: datasetToCreate.ressources[0]?.description ?? ''
            }
          ],
          title: datasetToCreate.title
        };

        expectedDatasets.push(dataset);

        return dataset;
      },
      addRessourceTo: (dataset: Dataset) => (): Dataset => dataset
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, { id: '', isOwner: false })({
      description: 'Lieux de médiation numérique au standard de la Mednum',
      frequency: 'daily',
      title: 'Lieux de médiation numérique',
      tags: ['inclusion'],
      license: 'lov2',
      zone: 'fr:region:84',
      granularity: 'poi',
      start: '2021-09-03',
      end: '2023-01-04',
      ressources: [
        {
          source: './assets/output/hinaura/services-inclusion-20230107_le-hub-hinaura.json',
          schema: 'gip-inclusion/data-inclusion-schema',
          description: "Structures de l'inclusion qui proposent des services de médiation numérique"
        }
      ]
    });

    expect(expectedDatasets).toStrictEqual([
      {
        id: '6a564acf45cf645dfa5d4cd5',
        description: 'Lieux de médiation numérique au standard de la Mednum',
        frequency: 'daily',
        title: 'Lieux de médiation numérique',
        ressources: [
          {
            id: '15e10bf7-6d6a-44a1-9d70-176a44fc92a5',
            name: 'services-inclusion-20230107_le-hub-hinaura.json',
            schema: 'gip-inclusion/data-inclusion-schema',
            description: "Structures de l'inclusion qui proposent des services de médiation numérique"
          }
        ]
      }
    ]);
  });

  it('should update existing dataset without ressources', async (): Promise<void> => {
    const expectedDatasets: Dataset[] = [];

    const publishDatasetRepository: PublishDatasetRepository = {
      get: (): Dataset[] => [
        {
          id: '6aacf16451afc56441ac64a6',
          description: 'Previous description',
          frequency: 'monthly',
          title: 'Lieux de médiation numérique',
          ressources: []
        }
      ],
      update: (updateDataset: PublishDataset, dataset: Dataset): Dataset => {
        const updatedDataset: Dataset = {
          description: updateDataset.description,
          frequency: updateDataset.frequency,
          id: dataset.id,
          ressources: [],
          title: updateDataset.title
        };

        expectedDatasets.push(updatedDataset);

        return updatedDataset;
      }
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, { id: '', isOwner: false })({
      description: 'Lieux de médiation numérique au standard de la Mednum',
      frequency: 'daily',
      title: 'Lieux de médiation numérique',
      tags: ['inclusion'],
      license: 'lov2',
      zone: 'fr:region:84',
      granularity: 'poi',
      start: '2021-09-03',
      end: '2023-01-04',
      ressources: []
    });

    expect(expectedDatasets).toStrictEqual([
      {
        description: 'Lieux de médiation numérique au standard de la Mednum',
        frequency: 'daily',
        id: '6aacf16451afc56441ac64a6',
        title: 'Lieux de médiation numérique',
        ressources: []
      }
    ]);
  });

  it('should update existing dataset with new ressources, no preexisting ressource', async (): Promise<void> => {
    const expectedDatasets: Dataset[] = [];

    const publishDatasetRepository: PublishDatasetRepository = {
      get: (): Dataset[] => [
        {
          id: '6aacf16451afc56441ac64a6',
          description: 'Previous description',
          frequency: 'monthly',
          title: 'Lieux de médiation numérique',
          ressources: []
        }
      ],
      update: (updateDataset: PublishDataset, dataset: Dataset): Dataset => {
        const updatedDataset: Dataset = {
          description: updateDataset.description,
          frequency: updateDataset.frequency,
          id: dataset.id,
          ressources: [
            {
              id: '15e10bf7-6d6a-44a1-9d70-176a44fc92a5',
              name: 'services-inclusion-20230107_le-hub-hinaura.json',
              schema: 'gip-inclusion/data-inclusion-schema',
              description: "Structures de l'inclusion qui proposent des services de médiation numérique"
            }
          ],
          title: updateDataset.title
        };

        expectedDatasets.push(updatedDataset);

        return updatedDataset;
      },
      updateRessourceFor: (dataset: Dataset) => (): Dataset => dataset
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, { id: '', isOwner: false })({
      description: 'Lieux de médiation numérique au standard de la Mednum',
      frequency: 'daily',
      title: 'Lieux de médiation numérique',
      tags: ['inclusion'],
      license: 'lov2',
      zone: 'fr:region:84',
      granularity: 'poi',
      start: '2021-09-03',
      end: '2023-01-04',
      ressources: [
        {
          source: './assets/output/hinaura/services-inclusion-20230107_le-hub-hinaura.json',
          schema: 'gip-inclusion/data-inclusion-schema',
          description: "Structures de l'inclusion qui proposent des services de médiation numérique"
        }
      ]
    });

    expect(expectedDatasets).toStrictEqual([
      {
        description: 'Lieux de médiation numérique au standard de la Mednum',
        frequency: 'daily',
        id: '6aacf16451afc56441ac64a6',
        title: 'Lieux de médiation numérique',
        ressources: [
          {
            id: '15e10bf7-6d6a-44a1-9d70-176a44fc92a5',
            name: 'services-inclusion-20230107_le-hub-hinaura.json',
            schema: 'gip-inclusion/data-inclusion-schema',
            description: "Structures de l'inclusion qui proposent des services de médiation numérique"
          }
        ]
      }
    ]);
  });

  it('should update existing dataset with new ressources, do not update preexisting ressource', async (): Promise<void> => {
    let expectedId: string | undefined = 'SHOULD_BE_UNDEFINED';

    const publishDatasetRepository: PublishDatasetRepository = {
      get: (): Dataset[] => [
        {
          id: '6aacf16451afc56441ac64a6',
          description: 'Previous description',
          frequency: 'monthly',
          title: 'Lieux de médiation numérique',
          ressources: [
            {
              id: '65af465a-8641-af68-5af4-1a65f1fc651a',
              name: 'preexisting-ressource.json',
              schema: 'gip-inclusion/data-inclusion-schema',
              description: 'This preexisting ressource should not be updated'
            }
          ]
        }
      ],
      update: (updateDataset: PublishDataset, dataset: Dataset): Dataset => ({
        description: updateDataset.description,
        frequency: updateDataset.frequency,
        id: dataset.id,
        ressources: [
          {
            id: '15e10bf7-6d6a-44a1-9d70-176a44fc92a5',
            name: 'services-inclusion-20230107_le-hub-hinaura.json',
            schema: 'gip-inclusion/data-inclusion-schema',
            description: "Structures de l'inclusion qui proposent des services de médiation numérique"
          }
        ],
        title: updateDataset.title
      }),
      updateRessourceFor:
        () =>
        (_: PublishRessource, id?: string): void => {
          expectedId = id;
        }
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, { id: '', isOwner: false })({
      description: 'Lieux de médiation numérique au standard de la Mednum',
      frequency: 'daily',
      title: 'Lieux de médiation numérique',
      tags: ['inclusion'],
      license: 'lov2',
      zone: 'fr:region:84',
      granularity: 'poi',
      start: '2021-09-03',
      end: '2023-01-04',
      ressources: [
        {
          source: './assets/output/hinaura/services-inclusion-20230107_le-hub-hinaura.json',
          schema: 'gip-inclusion/data-inclusion-schema',
          description: "Structures de l'inclusion qui proposent des services de médiation numérique"
        }
      ]
    });

    expect(expectedId).toBeUndefined();
  });

  it('should update existing dataset with new ressources, and also update preexisting ressource', async (): Promise<void> => {
    let expectedId: string | undefined = 'SHOULD_BE_RESSOURCE_ID';

    const publishDatasetRepository: PublishDatasetRepository = {
      get: (): Dataset[] => [
        {
          id: '6aacf16451afc56441ac64a6',
          description: 'Previous description',
          frequency: 'monthly',
          title: 'Lieux de médiation numérique',
          ressources: [
            {
              id: '65af465a-8641-af68-5af4-1a65f1fc651a',
              name: 'services-inclusion-20230107_le-hub-hinaura.json',
              schema: 'gip-inclusion/data-inclusion-schema',
              description: 'This preexisting ressource should not be updated'
            }
          ]
        }
      ],
      update: (updateDataset: PublishDataset, dataset: Dataset): Dataset => ({
        description: updateDataset.description,
        frequency: updateDataset.frequency,
        id: dataset.id,
        ressources: [
          {
            id: '65af465a-8641-af68-5af4-1a65f1fc651a',
            name: 'services-inclusion-20230107_le-hub-hinaura.json',
            schema: 'gip-inclusion/data-inclusion-schema',
            description: "Structures de l'inclusion qui proposent des services de médiation numérique"
          }
        ],
        title: updateDataset.title
      }),
      updateRessourceFor:
        () =>
        (_: PublishRessource, id?: string): void => {
          expectedId = id;
        }
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, { id: '', isOwner: false })({
      description: 'Lieux de médiation numérique au standard de la Mednum',
      frequency: 'daily',
      title: 'Lieux de médiation numérique',
      tags: ['inclusion'],
      license: 'lov2',
      zone: 'fr:region:84',
      granularity: 'poi',
      start: '2021-09-03',
      end: '2023-01-04',
      ressources: [
        {
          source: './assets/output/hinaura/services-inclusion-20230107_le-hub-hinaura.json',
          schema: 'gip-inclusion/data-inclusion-schema',
          description: "Structures de l'inclusion qui proposent des services de médiation numérique"
        }
      ]
    });

    expect(expectedId).toBe('65af465a-8641-af68-5af4-1a65f1fc651a');
  });

  it('should update existing dataset with new ressources, and also update preexisting ressource at different date', async (): Promise<void> => {
    let expectedId: string | undefined = 'SHOULD_BE_RESSOURCE_ID';

    const publishDatasetRepository: PublishDatasetRepository = {
      get: (): Dataset[] => [
        {
          id: '6aacf16451afc56441ac64a6',
          description: 'Previous description',
          frequency: 'monthly',
          title: 'Lieux de médiation numérique',
          ressources: [
            {
              id: '65af465a-8641-af68-5af4-1a65f1fc651a',
              name: 'services-inclusion-20230104_le-hub-hinaura.json',
              schema: 'gip-inclusion/data-inclusion-schema',
              description: 'This preexisting ressource should not be updated'
            }
          ]
        }
      ],
      update: (updateDataset: PublishDataset, dataset: Dataset): Dataset => ({
        description: updateDataset.description,
        frequency: updateDataset.frequency,
        id: dataset.id,
        ressources: [
          {
            id: '65af465a-8641-af68-5af4-1a65f1fc651a',
            name: 'services-inclusion-20230107_le-hub-hinaura.json',
            schema: 'gip-inclusion/data-inclusion-schema',
            description: "Structures de l'inclusion qui proposent des services de médiation numérique"
          }
        ],
        title: updateDataset.title
      }),
      updateRessourceFor:
        () =>
        (_: PublishRessource, id?: string): void => {
          expectedId = id;
        }
    } as unknown as PublishDatasetRepository;

    await publishDataset(publishDatasetRepository, { id: '', isOwner: false })({
      description: 'Lieux de médiation numérique au standard de la Mednum',
      frequency: 'daily',
      title: 'Lieux de médiation numérique',
      tags: ['inclusion'],
      license: 'lov2',
      zone: 'fr:region:84',
      granularity: 'poi',
      start: '2021-09-03',
      end: '2023-01-04',
      ressources: [
        {
          source: './assets/output/hinaura/services-inclusion-20230107_le-hub-hinaura.json',
          schema: 'gip-inclusion/data-inclusion-schema',
          description: "Structures de l'inclusion qui proposent des services de médiation numérique"
        }
      ]
    });

    expect(expectedId).toBe('65af465a-8641-af68-5af4-1a65f1fc651a');
  });
});
