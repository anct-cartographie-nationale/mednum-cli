import { type InjectionKey, keyFor } from '../../../../../libraries/injection/index.js';
import type { RemoteSourceSettings } from '../../../domain/index.js';
import type { SourceContent, SourceLocation } from '../domain/index.js';

export type FetchRemoteSource = (
  location: SourceLocation,
  settings: RemoteSourceSettings
) => Promise<Record<string, unknown> & SourceContent>;

export const FETCH_REMOTE_SOURCE: InjectionKey<FetchRemoteSource> = keyFor<FetchRemoteSource>(
  'acquisition-source.fetch-remote-source'
);
