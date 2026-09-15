import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, {
  retries: 5,
  retryCondition: (error): boolean =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response?.status ?? 0) >= 500,
  retryDelay: (retryCount: number): number => retryCount * 5000
});

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

/**
 * Suit `links.next` jusqu'au bout et rend les enregistrements accumulés. Leur type reste
 * `unknown` : seule l'enveloppe est connue, la charge utile n'a été vérifiée par personne.
 */
export const paginate = async (url: string | undefined, query: string = '', data: unknown[] = []): Promise<unknown[]> => {
  if (url == null) return data;

  const page: Pagination<unknown> = (await axios.get<Pagination<unknown>>(query === '' ? url : `${url}&${query}`)).data;

  return paginate(page.links.next, query, [...data, ...page.data]);
};
