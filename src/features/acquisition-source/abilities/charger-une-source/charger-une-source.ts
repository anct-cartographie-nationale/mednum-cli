import { inject } from '../../../../libraries/injection';
import { nextPageSettings, type RemoteSourceSettings, type SourceSettings } from '../../domain';
import { isRemote, nextSourceLocation, recordsOf, type SourceLocation, sourceLocationOf } from './domain';
import { FETCH_REMOTE_SOURCE, READ_LOCAL_SOURCE } from './keys';

const fetchRecords = async (location: SourceLocation, settings: RemoteSourceSettings): Promise<unknown[]> => {
  const content: Record<string, unknown> & { next?: string } = await inject(FETCH_REMOTE_SOURCE)(location, settings);
  const records: unknown[] = recordsOf(content, location.key);

  return content.next == null
    ? records
    : [...records, ...(await fetchRecords(nextSourceLocation(content.next, location.key), nextPageSettings(settings)))];
};

const readRecords = async (location: SourceLocation): Promise<unknown[]> =>
  recordsOf(await inject(READ_LOCAL_SOURCE)(location), location.key);

/**
 * Récupère les enregistrements bruts d'une source, distante ou locale, et les restitue sous
 * forme de document JSON prêt à être transformé.
 */
export const chargerUneSource = async ({ source, ...settings }: SourceSettings): Promise<string> => {
  const location: SourceLocation = sourceLocationOf(source);

  return JSON.stringify(isRemote(location) ? await fetchRecords(location, settings) : await readRecords(location));
};
