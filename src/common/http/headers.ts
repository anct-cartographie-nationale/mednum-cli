type Headers = Record<string, string>;

export type Api = {
  key: string;
  url?: string;
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

/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const authHeader = (apiKey?: string): Headers => (apiKey == null ? {} : { 'X-API-KEY': apiKey });
