import axios from 'axios';

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
