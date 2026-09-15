import axios, { type AxiosResponse } from 'axios';
import csv from 'csvtojson';
import iconv from 'iconv-lite';
import type { RemoteSourceSettings } from '../../../domain/index';
import type { SourceContent, SourceLocation } from '../domain/index';
import type { FetchRemoteSource } from '../keys/index';

const CSV_CONTENT_TYPE = 'text/csv';

const JSON_CONTENT_TYPES: readonly string[] = ['application/geo+json', 'application/json', 'application/vnd.geo+json'];

const contentType = (response: AxiosResponse): string => String(response.headers['content-type'] ?? '');

/**
 * Le format ne se devine pas dans les octets : au moment où il faudrait les lire, le flux n'a
 * encore rien émis. Seule la réponse le dit — son type de contenu, ou à défaut son URL, des
 * API servant du GeoJSON sans le déclarer. Tout ce qui n'est pas reconnu est lu comme du CSV.
 */
const isJsonContent = (response: AxiosResponse): boolean =>
  contentType(response) !== CSV_CONTENT_TYPE &&
  (response.config.url?.includes('geojson') === true ||
    JSON_CONTENT_TYPES.some((type: string): boolean => contentType(response).includes(type)));

const defaultIfUndefined = (toBeDefined: string | undefined, defaultValue: string): string =>
  toBeDefined !== undefined && toBeDefined !== '' ? toBeDefined : defaultValue;

const decodeBody = async (response: AxiosResponse, body: Buffer, encoding?: string, delimiter?: string): Promise<object> =>
  isJsonContent(response)
    ? JSON.parse(body.toString())
    : csv({ delimiter: defaultIfUndefined(delimiter, ','), ignoreEmpty: true }).fromString(
        iconv.decode(body, defaultIfUndefined(encoding, 'utf8'))
      );

/**
 * Le décodage doit pouvoir faire échouer la promesse. Rattaché directement au gestionnaire
 * `end`, son erreur resterait un rejet non traité et la promesse ne se règlerait jamais : la
 * commande resterait suspendue sur un corps illisible.
 */
const bodyOf = async (response: AxiosResponse, encoding?: string, delimiter?: string): Promise<object> => {
  const chunks: Uint8Array[] = [];

  response.data.on('data', (chunk: Uint8Array): number => chunks.push(chunk));

  return new Promise<object>(
    (resolve: (value: PromiseLike<object> | object) => void, reject: (reason?: Error) => void): void => {
      response.data.on('end', (): void => {
        decodeBody(response, Buffer.concat(chunks), encoding, delimiter).then(resolve, reject);
      });
      response.data.on('error', reject);
    }
  );
};

const authorizationHeaders = (apiEnvKey?: string): { headers: { Authorization: string } } | Record<string, never> => {
  const bearerToken: string | undefined = apiEnvKey == null ? undefined : process.env[apiEnvKey];
  return bearerToken ? { headers: { Authorization: `Bearer ${bearerToken}` } } : {};
};

export const fetchRemoteSourceWithAxios: FetchRemoteSource = async (
  { source }: SourceLocation,
  { encoding, delimiter, apiEnvKey }: RemoteSourceSettings
): Promise<Record<string, unknown> & SourceContent> =>
  (await bodyOf(
    await axios.get(source, { responseType: 'stream', ...authorizationHeaders(apiEnvKey) }),
    encoding,
    delimiter
  )) as Record<string, unknown> & SourceContent;
