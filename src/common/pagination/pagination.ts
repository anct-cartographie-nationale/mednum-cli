import axios from 'axios';
import axiosRetry from 'axios-retry';

// data.gouv runs an asynchronous analysis after each resource upload and answers 500 while it is still
// running, so a resource re-uploaded before its previous analysis completed fails transiently. Retry on
// any 5xx (including the upload POSTs) with a growing delay to let that analysis settle.
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

export const paginate = async <T>(url: string | undefined, query: string = '', data: T[] = []): Promise<T[]> => {
  if (url == null) return data;

  const nextResult: Pagination<T> = (await axios.get<Pagination<T>>(query === '' ? url : `${url}&${query}`)).data;

  return paginate(nextResult.links.next, query, [...data, ...nextResult.data]);
};
