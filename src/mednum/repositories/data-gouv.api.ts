type Headers = Record<string, string>;

//todo: externaliser process.env.DATA_GOUV_API_URL pour être indépendant du fichier .env
export const apiUrl = (): string => process.env.DATA_GOUV_API_URL ?? '';

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
