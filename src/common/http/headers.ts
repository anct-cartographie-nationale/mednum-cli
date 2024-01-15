/* eslint-disable @typescript-eslint/naming-convention */

type Headers<T> = Record<string, T>;

export type Api = {
  key: string;
  url: string;
};

export const headers = (headersToAppend?: Headers<string>): { headers: Headers<string> } => ({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...headersToAppend
  }
});

export const authHeader = (apiKey?: string): Headers<string> => (apiKey == null ? {} : { 'X-API-KEY': apiKey });

export const bearerTokenHeader = (apiKey: string): Headers<{ Authorization: string }> => ({
  headers: { Authorization: `Bearer ${apiKey}` }
});
