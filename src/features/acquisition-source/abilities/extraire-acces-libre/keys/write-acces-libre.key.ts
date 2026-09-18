import { type InjectionKey, keyFor } from '../../../../../libraries/injection';
import type { AccesLibreErp } from '../../../../../libraries/acces-libre';

export type WriteAccesLibre = (outputFile: string, erps: AccesLibreErp[]) => void;

export const WRITE_ACCES_LIBRE: InjectionKey<WriteAccesLibre> = keyFor<WriteAccesLibre>('acquisition-source.write-acces-libre');
