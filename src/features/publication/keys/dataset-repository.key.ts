import { type InjectionKey, keyFor } from '../../../libraries/injection/index.js';
import type { DatasetRepository } from '../domain/index.js';

export const DATASET_REPOSITORY: InjectionKey<DatasetRepository> = keyFor<DatasetRepository>('publication.dataset-repository');
