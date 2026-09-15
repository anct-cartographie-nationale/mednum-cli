import { inject } from '../../../../libraries/injection/index.js';
import { followPages, type Page, type ReadPage } from '../../../../libraries/http/index.js';
import type { RemoteSourceSettings, SourceSettings } from '../../domain/index.js';
import {
  isRemote,
  nextSourceLocation,
  recordsOf,
  type SourceContent,
  type SourceLocation,
  sourceLocationOf
} from './domain/index.js';
import { FETCH_REMOTE_SOURCE, READ_LOCAL_SOURCE } from './keys/index.js';

/** Stratégie à lien racine : la page suivante est l'URL portée par `next`, à côté des données. */
const readSourcePage =
  (settings: RemoteSourceSettings): ReadPage<SourceLocation> =>
  async (location: SourceLocation): Promise<Page<SourceLocation>> => {
    const content: Record<string, unknown> & SourceContent = await inject(FETCH_REMOTE_SOURCE)(location, settings);

    return {
      records: recordsOf(content, location.key),
      next: content.next == null ? undefined : nextSourceLocation(content.next, location.key)
    };
  };

const readRecords = async (location: SourceLocation): Promise<unknown[]> =>
  recordsOf(await inject(READ_LOCAL_SOURCE)(location), location.key);

/**
 * Récupère les enregistrements bruts d'une source, distante ou locale, et les restitue tels
 * quels. Les interpréter revient à la capacité qui les a demandés.
 */
export const chargerUneSource = async ({ source, ...settings }: SourceSettings): Promise<unknown[]> => {
  const location: SourceLocation = sourceLocationOf(source);

  return isRemote(location) ? followPages(location, readSourcePage(settings)) : readRecords(location);
};
