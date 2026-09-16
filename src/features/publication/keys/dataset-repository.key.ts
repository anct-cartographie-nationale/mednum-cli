import { type InjectionKey, keyFor } from '../../../libraries/injection';
import type { DatasetRepository } from '../domain';

export const DATASET_REPOSITORY: InjectionKey<DatasetRepository> = keyFor<DatasetRepository>('publication.dataset-repository');
