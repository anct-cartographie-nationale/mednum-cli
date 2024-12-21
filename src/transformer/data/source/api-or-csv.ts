import axios, { AxiosResponse } from 'axios';
import * as fs from 'fs';
import iconv from 'iconv-lite';
import csv from 'csvtojson';

export type SourceSettings = {
  source: string;
  encoding?: string;
  delimiter?: string;
};
const fromJson = <T>(response: Record<string, T>, key?: string): T[] =>
  key == null ? Object.values(response) : Object.values(response[key] ?? {});

const inputIsJson = (response: AxiosResponse): boolean =>
  response.config.url?.includes('geojson') === true ||
  response.headers['content-type']?.includes('application/geo+json') === true ||
  response.headers['content-type']?.includes('application/json') === true ||
  response.headers['content-type']?.includes('application/vnd.geo+json') === true;

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
            ? await csv({ delimiter: defaultIfUndefined(delimiter, ',') }).fromString(
                iconv.decode(Buffer.concat(chunks), defaultIfUndefined(encoding, 'utf8'))
              )
            : JSON.parse(Buffer.concat(chunks).toString())
        );
      });
      response.data.on('error', reject);
    }
  );

const streamFromAPI = async (response: AxiosResponse, encoding?: string, delimiter?: string): Promise<object> => {
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

const fetchFrom = async ([source, key]: string[], encoding?: string, delimiter?: string): Promise<string[]> => {
  const response: { next?: string } = await streamFromAPI(
    await axios.get(source ?? '', { responseType: 'stream' }),
    encoding,
    delimiter
  );

  const data: string[] = fromJson(response, key);

  return response.next == null
    ? data
    : [...data, ...(await fetchFrom(`${response.next}@${key}`.split('@'), encoding, delimiter))];
};

const readFrom = async ([source, key]: string[]): Promise<string> =>
  JSON.stringify(fromJson(JSON.parse(await fs.promises.readFile(source ?? '', 'utf-8')), key));

export const sourceATransformer = async ({ source, encoding = '', delimiter = '' }: SourceSettings): Promise<string> =>
  source.startsWith('http')
    ? JSON.stringify(await fetchFrom(source.split('@'), encoding, delimiter))
    : readFrom(source.split('@'));
