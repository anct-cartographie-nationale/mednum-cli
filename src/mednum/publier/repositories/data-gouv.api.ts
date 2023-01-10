type Headers = Record<string, string>;

export type Api = {
  key: string;
  url: string;
};

export const headers = (headersToAppend?: Headers): { headers: Headers } => ({
  headers: {
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    Accept: 'application/json',
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    'Content-Type': 'application/json',
    ...headersToAppend
  }
});

export const authHeader = (apiKey: string): Headers => ({
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  'X-API-KEY': apiKey
});
