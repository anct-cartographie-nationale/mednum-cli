import { type InjectionKey, keyFor } from '../../../../../libraries/injection/index.js';
import type { SourceLocation } from '../domain/index.js';

export type ReadLocalSource = (location: SourceLocation) => Promise<Record<string, unknown>>;

export const READ_LOCAL_SOURCE: InjectionKey<ReadLocalSource> = keyFor<ReadLocalSource>('acquisition-source.read-local-source');
