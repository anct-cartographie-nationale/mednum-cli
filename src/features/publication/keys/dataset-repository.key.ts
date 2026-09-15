import { type InjectionKey, keyFor } from '../../../libraries/injection/index';
import type { DatasetRepository } from '../domain/index';

export const DATASET_REPOSITORY: InjectionKey<DatasetRepository> = keyFor<DatasetRepository>('publication.dataset-repository');
