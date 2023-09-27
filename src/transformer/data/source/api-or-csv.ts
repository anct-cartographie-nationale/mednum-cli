import axios, { AxiosResponse } from 'axios';
/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import * as fs from 'fs';
// todo: remove link to cli
import { TransformerOptions } from '../../cli/transformer-options';

/* eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/typedef, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const iconv = require('iconv-lite');
/* eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/typedef, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const csv = require('csvtojson');

const fromJson = <T>(response: Record<string, T>, key?: string): T[] =>
  key == null ? Object.values(response) : Object.values(response[key] ?? {});

const inputIsJson = (response: AxiosResponse): boolean =>
  response.config.url?.includes('geojson') === true ||
  response.headers['content-type']?.includes('application/geo+json') === true ||
  response.headers['content-type']?.includes('application/json') === true;

const defaultIfUndefined = (toBeDefined: string | undefined, defaultValue: string): string =>
  toBeDefined !== undefined && toBeDefined !== '' ? toBeDefined : defaultValue;

const streamPromise = async (
  notJson: boolean,
  chunks: Uint8Array[],
  response: AxiosResponse,
  key?: string,
  encoding?: string,
  delimiter?: string
): Promise<string> =>
  new Promise<string>(
    (resolve: (promesseValue: PromiseLike<string> | string) => void, reject: (reason?: Error) => void): void => {
      response.data.on('end', async (): Promise<void> => {
        resolve(
          JSON.stringify(
            response.headers['content-type'] === 'text/csv' || notJson
              ? await csv({ delimiter: defaultIfUndefined(delimiter, ',') }).fromString(
                  iconv.decode(Buffer.concat(chunks), defaultIfUndefined(encoding, 'utf8'))
                )
              : fromJson(JSON.parse(Buffer.concat(chunks).toString()), key)
          )
        );
      });
      response.data.on('error', reject);
    }
  );

const streamFromAPI = async (response: AxiosResponse, key?: string, encoding?: string, delimiter?: string): Promise<string> => {
  const chunks: Uint8Array[] = [];

  response.data.on('data', (chunk: Uint8Array): number => chunks.push(chunk));

  let notJson: boolean = false;
  try {
    JSON.parse(Buffer.concat(chunks).toString());
  } catch (_) {
    notJson = !inputIsJson(response);
  }

  return streamPromise(notJson, chunks, response, key, encoding, delimiter);
};

const fetchFrom = async ([source, key]: string[], encoding?: string, delimiter?: string): Promise<string> =>
  streamFromAPI(await axios.get(source ?? '', { responseType: 'stream' }), key, encoding, delimiter);

const readFrom = async ([source, key]: string[]): Promise<string> =>
  JSON.stringify(fromJson(JSON.parse(await fs.promises.readFile(source ?? '', 'utf-8')), key));

export const sourceATransformer = async (transformerOptions: TransformerOptions): Promise<string> =>
  transformerOptions.source.startsWith('http')
    ? fetchFrom(transformerOptions.source.split('@'), transformerOptions.encoding ?? '', transformerOptions.delimiter ?? '')
    : readFrom(transformerOptions.source.split('@'));
