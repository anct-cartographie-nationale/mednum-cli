import { type InjectionKey, keyFor } from '../../../../../libraries/injection/index';
import type { RemoteSourceSettings } from '../../../domain/index';
import type { SourceContent, SourceLocation } from '../domain/index';

export type FetchRemoteSource = (
  location: SourceLocation,
  settings: RemoteSourceSettings
) => Promise<Record<string, unknown> & SourceContent>;

export const FETCH_REMOTE_SOURCE: InjectionKey<FetchRemoteSource> = keyFor<FetchRemoteSource>(
  'acquisition-source.fetch-remote-source'
);
