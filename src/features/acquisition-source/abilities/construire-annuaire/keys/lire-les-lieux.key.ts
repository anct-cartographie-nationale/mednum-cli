import { type InjectionKey, keyFor } from '../../../../../libraries/injection';
import type { LieuLocalise } from '../domain';

export type LireLesLieux = (motif: string) => LieuLocalise[];

export const LIRE_LES_LIEUX: InjectionKey<LireLesLieux> = keyFor<LireLesLieux>('acquisition-source.lire-les-lieux');
