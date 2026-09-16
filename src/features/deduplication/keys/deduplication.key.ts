import { type InjectionKey, keyFor } from '../../../libraries/injection';
import type { IsIncluded, LoadLieux, SaveDeduplication } from '../domain';

export const LOAD_LIEUX: InjectionKey<LoadLieux> = keyFor<LoadLieux>('deduplication.load-lieux');

export const SAVE_DEDUPLICATION: InjectionKey<SaveDeduplication> = keyFor<SaveDeduplication>(
  'deduplication.save-deduplication'
);

export const IS_INCLUDED: InjectionKey<IsIncluded> = keyFor<IsIncluded>('deduplication.is-included');
