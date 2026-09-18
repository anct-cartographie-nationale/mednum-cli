import { type InjectionKey, keyFor } from '../../../../../libraries/injection';
import type { AccesLibreErp } from '../../../../../libraries/acces-libre';

export type FetchAccesLibre = () => Promise<AccesLibreErp[]>;

export const FETCH_ACCES_LIBRE: InjectionKey<FetchAccesLibre> = keyFor<FetchAccesLibre>('acquisition-source.fetch-acces-libre');
