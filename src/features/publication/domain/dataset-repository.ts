import type { Dataset } from './dataset.js';
import type { PublishDataset } from './publish-dataset.js';
import type { PublishRessource } from './publish-ressource.js';
import type { Reference } from './reference.js';

/**
 * Le contrat que la publication attend de l'entrepôt de jeux de données, sans rien présumer
 * de la plateforme qui le réalise.
 */
export type DatasetRepository = {
  get: (reference: Reference) => Promise<Dataset[]>;
  post: (datasetToCreate: PublishDataset, reference: Reference) => Promise<Dataset>;
  update: (datasetToUpdate: PublishDataset, dataset: Dataset) => Promise<Dataset>;
  addRessourceTo: (dataset: Dataset) => (ressource: PublishRessource) => Promise<void>;
  updateRessourceFor: (dataset: Dataset) => (ressource: PublishRessource, ressourceId?: string) => Promise<void>;
};
