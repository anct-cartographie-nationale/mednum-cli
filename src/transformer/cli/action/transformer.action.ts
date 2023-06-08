/* eslint-disable @typescript-eslint/no-restricted-imports, @typescript-eslint/naming-convention, @typescript-eslint/prefer-nullish-coalescing */
import * as fs from 'fs';
import axios, { AxiosResponse } from 'axios';
import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Report } from '../../report';
import { toLieuxMediationNumerique, validValuesOnly } from '../../input';
import { writeErrorsOutputFiles, writeOutputFiles } from '../../output';
import { TransformerOptions } from '../transformer-options';
import { Erp } from '../../fields/accessibilite/accessibilite.field.presentation';

/* eslint-disable max-lines-per-function, max-statements, @typescript-eslint/strict-boolean-expressions */
/* eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/typedef, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const iconv = require('iconv-lite');

/* eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/typedef, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const csv = require('csvtojson');

/* eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/typedef, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const flatten = require('flat');

const REPORT: Report = Report();

type LieuMediationNumeriqueById = Record<string, LieuMediationNumerique>;

const fromJson = <T>(response: Record<string, T>, key?: string): T[] =>
  key == null ? Object.values(response) : Object.values(response[key] ?? {});

const inputIsJson = (response: AxiosResponse): boolean =>
  (response.config.url?.includes('geojson') ||
    response.headers['content-type']?.includes('application/geo+json') ||
    response.headers['content-type']?.includes('application/json')) ??
  false;

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
    notJson = !inputIsJson(response);
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

const replaceNullWithEmptyString = (jsonString: string): string => {
  const jsonObj: Record<string, string> = JSON.parse(jsonString);
  const replacer = (_: string, values?: string): string => values ?? '';
  return JSON.stringify(jsonObj, replacer);
};

const fetchAccesLibreData = async (): Promise<string> =>
  JSON.stringify(
    await csv().fromString(
      (
        await axios.get('https://www.data.gouv.fr/fr/datasets/r/93ae96a7-1db7-4cb4-a9f1-6d778370b640')
      ).data
    )
  );

export const transformerAction = async (transformerOptions: TransformerOptions): Promise<void> => {
  await Promise.all([
    transformerOptions.source.startsWith('http')
      ? await fetchFrom(
          transformerOptions.source.split('@'),
          transformerOptions.encoding ?? '',
          transformerOptions.delimiter ?? ''
        )
      : await readFrom(transformerOptions.source.split('@')),
    fs.promises.readFile(transformerOptions.configFile, 'utf-8'),
    await fetchAccesLibreData()
  ]).then(([input, matching, accesLibreData]: [string, string, string]): void => {
    const accesLibreErps: Erp[] = JSON.parse(accesLibreData);
    const lieuxDeMediationNumerique: LieuMediationNumerique[] = JSON.parse(replaceNullWithEmptyString(input))
      .map(flatten)
      .map(toLieuxMediationNumerique(matching, transformerOptions.sourceName, REPORT, accesLibreErps))
      .filter(validValuesOnly);

    const lieuxDeMediationNumeriqueFiltered: LieuMediationNumeriqueById = lieuxDeMediationNumerique.reduce(
      (lieuxById: LieuMediationNumeriqueById, lieu: LieuMediationNumerique): LieuMediationNumeriqueById => ({
        ...lieuxById,
        [lieu.id]: lieu
      }),
      {}
    );

    const lieuxDeMediationNumeriqueWithSingleIds: LieuMediationNumerique[] = Object.values(lieuxDeMediationNumeriqueFiltered);
    writeErrorsOutputFiles({
      path: transformerOptions.outputDirectory,
      name: transformerOptions.sourceName,
      territoire: transformerOptions.territory
    })(REPORT);

    writeOutputFiles({
      path: transformerOptions.outputDirectory,
      name: transformerOptions.sourceName,
      territoire: transformerOptions.territory
    })(lieuxDeMediationNumeriqueWithSingleIds);
  });
};
