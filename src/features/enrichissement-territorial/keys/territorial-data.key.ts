import type { Commune, FrrMap, QpvShapesMap } from '../../../libraries/collectivites/index';
import { type InjectionKey, keyFor } from '../../../libraries/injection/index';

export type LoadCommunes = () => Promise<Commune[]>;

export const LOAD_COMMUNES: InjectionKey<LoadCommunes> = keyFor<LoadCommunes>('enrichissement-territorial.load-communes');

export type LoadQpvShapes = () => Promise<QpvShapesMap>;

export const LOAD_QPV_SHAPES: InjectionKey<LoadQpvShapes> = keyFor<LoadQpvShapes>('enrichissement-territorial.load-qpv-shapes');

export type LoadFrr = () => Promise<FrrMap>;

export const LOAD_FRR: InjectionKey<LoadFrr> = keyFor<LoadFrr>('enrichissement-territorial.load-frr');
