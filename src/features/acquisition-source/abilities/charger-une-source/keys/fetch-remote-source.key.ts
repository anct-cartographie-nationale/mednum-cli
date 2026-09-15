import { type InjectionKey, keyFor } from '../../../../../libraries/injection';
import type { RemoteSourceSettings } from '../../../domain';
import type { SourceContent, SourceLocation } from '../domain';

export type FetchRemoteSource = (
  location: SourceLocation,
  settings: RemoteSourceSettings
) => Promise<Record<string, unknown> & SourceContent>;

export const FETCH_REMOTE_SOURCE: InjectionKey<FetchRemoteSource> = keyFor<FetchRemoteSource>(
  'acquisition-source.fetch-remote-source'
);
