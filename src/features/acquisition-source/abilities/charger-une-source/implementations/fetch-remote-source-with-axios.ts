import axios, { type AxiosResponse } from 'axios';
import csv from 'csvtojson';
import iconv from 'iconv-lite';
import type { RemoteSourceSettings } from '../../../domain';
import type { SourceContent, SourceLocation } from '../domain';
import type { FetchRemoteSource } from '../keys';

const TYPES_DE_CONTENU_JSON: readonly string[] = ['application/geo+json', 'application/json', 'application/vnd.geo+json'];

const contentType = (response: AxiosResponse): string => String(response.headers['content-type'] ?? '');

const inputIsJson = (response: AxiosResponse): boolean =>
  response.config.url?.includes('geojson') === true ||
  TYPES_DE_CONTENU_JSON.some((type: string): boolean => contentType(response).includes(type));

const defaultIfUndefined = (toBeDefined: string | undefined, defaultValue: string): string =>
  toBeDefined !== undefined && toBeDefined !== '' ? toBeDefined : defaultValue;

const streamPromise = async (
  notJson: boolean,
  chunks: Uint8Array[],
  response: AxiosResponse,
  encoding?: string,
  delimiter?: string
): Promise<object> =>
  new Promise<object>(
    (resolve: (promesseValue: PromiseLike<object> | object) => void, reject: (reason?: Error) => void): void => {
      response.data.on('end', async (): Promise<void> => {
        resolve(
          response.headers['content-type'] === 'text/csv' || notJson
            ? await csv({ delimiter: defaultIfUndefined(delimiter, ','), ignoreEmpty: true }).fromString(
                iconv.decode(Buffer.concat(chunks), defaultIfUndefined(encoding, 'utf8'))
              )
            : JSON.parse(Buffer.concat(chunks).toString())
        );
      });
      response.data.on('error', reject);
    }
  );

const streamFromApi = async (response: AxiosResponse, encoding?: string, delimiter?: string): Promise<object> => {
  const chunks: Uint8Array[] = [];

  response.data.on('data', (chunk: Uint8Array): number => chunks.push(chunk));

  let notJson: boolean = false;
  try {
    JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    notJson = !inputIsJson(response);
  }

  return streamPromise(notJson, chunks, response, encoding, delimiter);
};

const authorizationHeaders = (apiEnvKey?: string): { headers: { Authorization: string } } | Record<string, never> => {
  const bearerToken: string | undefined = apiEnvKey == null ? undefined : process.env[apiEnvKey];
  return bearerToken ? { headers: { Authorization: `Bearer ${bearerToken}` } } : {};
};

export const fetchRemoteSourceWithAxios: FetchRemoteSource = async (
  { source }: SourceLocation,
  { encoding, delimiter, apiEnvKey }: RemoteSourceSettings
): Promise<Record<string, unknown> & SourceContent> =>
  (await streamFromApi(
    await axios.get(source, { responseType: 'stream', ...authorizationHeaders(apiEnvKey) }),
    encoding,
    delimiter
  )) as Record<string, unknown> & SourceContent;
