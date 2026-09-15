import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, {
  retries: 5,
  retryCondition: (error): boolean =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response?.status ?? 0) >= 500,
  retryDelay: (retryCount: number): number => retryCount * 5000
});

export type Page<TCursor> = {
  records: unknown[];
  next: TCursor | undefined;
};

export type ReadPage<TCursor> = (cursor: TCursor) => Promise<Page<TCursor>>;

/**
 * La seule récursion de pagination du dépôt. Elle ignore ce qu'est une page suivante : c'est
 * la stratégie de lecture qui le dit, en rendant le curseur de la suivante ou rien.
 *
 * Les enregistrements restent `unknown` : seule la forme de l'enveloppe a été reconnue.
 */
export const followPages = async <TCursor>(
  cursor: TCursor | undefined,
  readPage: ReadPage<TCursor>,
  records: unknown[] = []
): Promise<unknown[]> => {
  if (cursor == null) return records;

  const page: Page<TCursor> = await readPage(cursor);

  return followPages(page.next, readPage, [...records, ...page.records]);
};

export type Pagination<T> = {
  data: T[];
  links: {
    self: string;
    first: string;
    last: string;
    next?: string;
    previous?: string;
  };
};

/** Stratégie JSON:API : la page suivante est l'URL portée par `links.next`. */
const byLinksNext =
  (query: string): ReadPage<string> =>
  async (url: string): Promise<Page<string>> => {
    const page: Pagination<unknown> = (await axios.get<Pagination<unknown>>(query === '' ? url : `${url}&${query}`)).data;

    return { records: page.data, next: page.links.next };
  };

export const paginate = async (url: string | undefined, query: string = ''): Promise<unknown[]> =>
  followPages(url, byLinksNext(query));
