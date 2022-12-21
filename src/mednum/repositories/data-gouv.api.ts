type Headers = Record<string, string>;

const PROTOCOL: string = 'https://';
const HOST: string = 'demo.data.gouv.fr';
const API: string = '/api/1';
export const API_URL: string = `${PROTOCOL}${HOST}${API}`;

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
