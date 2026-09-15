import axios from 'axios';
import type { SchemaServiceDataInclusion, SchemaStructureDataInclusion } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { type Api, bearerTokenHeader, followPages, type Page, type ReadPage } from '../http';

const DATA_INCLUSION_API_URL = 'https://api.data.inclusion.gouv.fr/api/v1';

const FIRST_PAGE = 1;

type PageCursor = {
  url: string;
  page: number;
};

type DataInclusionPage = {
  items?: unknown;
  pages?: unknown;
};

/**
 * L'API annonce son nombre total de pages dans chaque réponse. Ne pas l'y trouver signifie que
 * sa forme a changé : on ne peut alors ni savoir s'il reste des pages, ni prétendre que non.
 */
const nextCursor = ({ url, page }: PageCursor, { pages }: DataInclusionPage): PageCursor | undefined => {
  if (typeof pages !== 'number') throw new Error(`Réponse de data.inclusion sans nombre de pages : ${url}`);

  return page < pages ? { url, page: page + 1 } : undefined;
};

const recordsOf = ({ items }: DataInclusionPage, url: string): unknown[] => {
  if (!Array.isArray(items)) throw new Error(`Réponse de data.inclusion sans liste d'éléments : ${url}`);

  return items;
};

/** Stratégie à compteur : la page suivante est la suivante, tant qu'on n'a pas atteint le total. */
const byPageCount =
  (key: string): ReadPage<PageCursor> =>
  async (cursor: PageCursor): Promise<Page<PageCursor>> => {
    const body: DataInclusionPage = (await axios.get(`${cursor.url}&page=${cursor.page}`, bearerTokenHeader(key))).data;

    return { records: recordsOf(body, cursor.url), next: nextCursor(cursor, body) };
  };

const fetchFromDataInclusionApi = async <T>({ key, url }: Api): Promise<T[]> =>
  (await followPages({ url, page: FIRST_PAGE }, byPageCount(key))) as T[];

export const structuresFromDataInclusionApi = async (
  apiKey: string,
  sources: string
): Promise<SchemaStructureDataInclusion[]> =>
  fetchFromDataInclusionApi({ key: apiKey, url: `${DATA_INCLUSION_API_URL}/structures?sources=${sources}` });

export const servicesFromDataInclusionApi = async (apiKey: string, sources: string): Promise<SchemaServiceDataInclusion[]> =>
  fetchFromDataInclusionApi({ key: apiKey, url: `${DATA_INCLUSION_API_URL}/services?sources=${sources}` });
