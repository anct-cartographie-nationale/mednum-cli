/* eslint-disable-next-line @typescript-eslint/no-restricted-imports, @typescript-eslint/naming-convention */
import * as fs from 'fs';
import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Report } from '../../report';
import { toLieuxMediationNumerique, validValuesOnly } from '../../input';
import { writeErrorsOutputFiles, writeOutputFiles } from '../../output';
import { TransformerOptions } from '../transformer-options';
import axios, { AxiosResponse } from 'axios';

/* eslint-disable max-lines-per-function, max-statements, @typescript-eslint/strict-boolean-expressions */
/* eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/typedef, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const iconv = require('iconv-lite');

/* eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/typedef, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const csv = require('csvtojson');

/* eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/typedef, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const flatten = require('flat');

const REPORT: Report = Report();

const fromJson = <T>(response: Record<string, T>, key?: string): T[] =>
  key == null ? Object.values(response) : Object.values(response[key] ?? {});

const getDataFromAPI = async (
  response: AxiosResponse,
  key?: string,
  encoding?: string,
  delimiter?: string
): Promise<string> => {
  const fromEncoding: string = encoding !== undefined && encoding !== '' ? encoding : 'utf8';
  const fromDelimiter: string = delimiter !== undefined && delimiter !== '' ? delimiter : ',';
  const chunks: Uint8Array[] = [];

  response.data.on('data', (chunk: Uint8Array): number => chunks.push(chunk));

  let notJson: boolean = false;
  try {
    JSON.parse(Buffer.concat(chunks).toString());
  } catch (_) {
    notJson = true;
    notJson = response.headers['content-type']?.includes('application/geo+json') ? false : notJson;
    notJson = response.headers['content-type']?.includes('application/json') ? false : notJson;
  }

  return new Promise<string>(
    (resolve: (promesseValue: PromiseLike<string> | string) => void, reject: (reason?: Error) => void): void => {
      response.data.on('end', async (): Promise<void> => {
        const decodedBody: Record<string, unknown> = iconv.decode(Buffer.concat(chunks), fromEncoding);
        resolve(
          JSON.stringify(
            response.headers['content-type'] === 'text/csv' || notJson
              ? await csv({ delimiter: fromDelimiter }).fromString(decodedBody as unknown as string)
              : fromJson(JSON.parse(Buffer.concat(chunks).toString()), key)
          )
        );
      });
      response.data.on('error', reject);
    }
  );
};

const fetchFrom = async ([source, key]: string[], encoding?: string, delimiter?: string): Promise<string> =>
  getDataFromAPI(await axios.get(source ?? '', { responseType: 'stream' }), key, encoding, delimiter);

const readFrom = async ([source, key]: string[]): Promise<string> =>
  JSON.stringify(fromJson(JSON.parse(await fs.promises.readFile(source ?? '', 'utf-8')), key));

export const transformerAction = async (transformerOptions: TransformerOptions): Promise<void> => {
  await Promise.all([
    transformerOptions.source.startsWith('http')
      ? await fetchFrom(
          transformerOptions.source.split('@'),
          transformerOptions.encoding ?? '',
          transformerOptions.delimiter ?? ''
        )
      : await readFrom(transformerOptions.source.split('@')),
    fs.promises.readFile(transformerOptions.configFile, 'utf-8')
  ]).then(([input, matching]: [string, string]): void => {
    const lieuxDeMediationNumerique: LieuMediationNumerique[] = JSON.parse(input)
      .map(flatten)
      .map(toLieuxMediationNumerique(matching, transformerOptions.sourceName, REPORT))
      .filter(validValuesOnly);

    writeErrorsOutputFiles({
      path: transformerOptions.outputDirectory,
      name: transformerOptions.sourceName,
      territoire: transformerOptions.territory
    })(REPORT);

    writeOutputFiles({
      path: transformerOptions.outputDirectory,
      name: transformerOptions.sourceName,
      territoire: transformerOptions.territory
    })(lieuxDeMediationNumerique);
  });
};
