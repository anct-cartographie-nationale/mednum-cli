import { inject } from '../../../../libraries/injection/index.js';
import type { RemoteSourceSettings, SourceSettings } from '../../domain/index.js';
import { isRemote, nextSourceLocation, recordsOf, type SourceLocation, sourceLocationOf } from './domain/index.js';
import { FETCH_REMOTE_SOURCE, READ_LOCAL_SOURCE } from './keys/index.js';

const fetchRecords = async (location: SourceLocation, settings: RemoteSourceSettings): Promise<unknown[]> => {
  const content: Record<string, unknown> & { next?: string } = await inject(FETCH_REMOTE_SOURCE)(location, settings);
  const records: unknown[] = recordsOf(content, location.key);

  return content.next == null
    ? records
    : [...records, ...(await fetchRecords(nextSourceLocation(content.next, location.key), settings))];
};

const readRecords = async (location: SourceLocation): Promise<unknown[]> =>
  recordsOf(await inject(READ_LOCAL_SOURCE)(location), location.key);

/**
 * Récupère les enregistrements bruts d'une source, distante ou locale, et les restitue tels
 * quels. Les interpréter revient à la capacité qui les a demandés.
 */
export const chargerUneSource = async ({ source, ...settings }: SourceSettings): Promise<unknown[]> => {
  const location: SourceLocation = sourceLocationOf(source);

  return isRemote(location) ? fetchRecords(location, settings) : readRecords(location);
};
