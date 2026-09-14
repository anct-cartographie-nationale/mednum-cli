import {
  addDataGouvRessource,
  createDataGouvDataset,
  type DataGouvDataset,
  type DataGouvDatasetPayload,
  type DataGouvRessource,
  describeDataGouvRessource,
  listDataGouvDatasets,
  replaceDataGouvDataset,
  replaceDataGouvRessource
} from '../../../libraries/data-gouv/index.js';
import type { Api } from '../../../libraries/http/index.js';
import type { Dataset, DatasetRepository, PublishDataset, PublishRessource, Reference, Ressource } from '../domain/index.js';

const toRessource = (dataGouvRessource: DataGouvRessource): Ressource => ({
  id: dataGouvRessource.id,
  name: dataGouvRessource.title,
  description: dataGouvRessource.description,
  ...(dataGouvRessource.schema == null ? {} : { schema: dataGouvRessource.schema.name })
});

const toDataset = (dataGouvDataset: DataGouvDataset): Dataset => ({
  description: dataGouvDataset.description,
  frequency: dataGouvDataset.frequency,
  id: dataGouvDataset.id,
  ressources: dataGouvDataset.resources.map(toRessource),
  title: dataGouvDataset.title
});

const toDatasetPayload = (publishDataset: PublishDataset, reference?: Reference): DataGouvDatasetPayload => ({
  description: publishDataset.description,
  frequency: publishDataset.frequency,
  title: publishDataset.title,
  license: publishDataset.license,
  ...(reference == null || reference.isOwner ? {} : { organization: { id: reference.id } }),
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

const describe = async (api: Api, datasetId: string, ressourceId: string, ressource: PublishRessource): Promise<void> =>
  describeDataGouvRessource(api, datasetId, ressourceId, {
    schema: ressource.schema,
    description: ressource.description
  });

export const datasetRepositoryOnDataGouv = (api: Api): DatasetRepository => ({
  get: async (reference: Reference): Promise<Dataset[]> => (await listDataGouvDatasets(api, reference)).map(toDataset),

  post: async (datasetToCreate: PublishDataset, reference: Reference): Promise<Dataset> =>
    (await createDataGouvDataset(api, toDatasetPayload(datasetToCreate, reference))) as unknown as Dataset,

  update: async (datasetToUpdate: PublishDataset, dataset: Dataset): Promise<Dataset> =>
    (await replaceDataGouvDataset(api, dataset.id, toDatasetPayload(datasetToUpdate))) as unknown as Dataset,

  addRessourceTo:
    (dataset: Dataset) =>
    async (ressource: PublishRessource): Promise<void> =>
      describe(api, dataset.id, await addDataGouvRessource(api, dataset.id, ressource.source), ressource),

  updateRessourceFor:
    (dataset: Dataset) =>
    async (ressource: PublishRessource, ressourceId?: string): Promise<void> => {
      await replaceDataGouvRessource(api, dataset.id, ressourceId, ressource.source);
      await describe(api, dataset.id, ressourceId ?? '', ressource);
    }
});
