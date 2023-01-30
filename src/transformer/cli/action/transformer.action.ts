/* eslint-disable-next-line @typescript-eslint/no-restricted-imports, @typescript-eslint/naming-convention */
import * as fs from 'fs';
import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Report } from '../../report';
import { toLieuxMediationNumerique, validValuesOnly } from '../../input';
import { writeOutputFiles } from '../../output';
import { TransformerOptions } from '../transformer-options';
import axios, { AxiosResponse } from 'axios';

/* eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/typedef, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const csv = require('csvtojson');

/* eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/typedef, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const flatten = require('flat');

const REPORT: Report = Report();

const fromJson = <T>(response: Record<string, T>, key?: string): T[] =>
  key == null ? Object.values(response) : Object.values(response[key] ?? {});

const getDataFromAPI = async (response: AxiosResponse, key?: string): Promise<string> =>
  JSON.stringify(
    response.headers['content-type'] === 'text/csv' ? await csv().fromString(response.data) : fromJson(response.data, key)
  );

const fetchFrom = async ([source, key]: string[]): Promise<string> => getDataFromAPI(await axios.get(source ?? ''), key);

const readFrom = async ([source, key]: string[]): Promise<string> =>
  JSON.stringify(fromJson(JSON.parse(await fs.promises.readFile(source ?? '', 'utf-8')), key));

export const transformerAction = async (transformerOptions: TransformerOptions): Promise<void> => {
  await Promise.all([
    transformerOptions.source.startsWith('http')
      ? await fetchFrom(transformerOptions.source.split('@'))
      : await readFrom(transformerOptions.source.split('@')),
    fs.promises.readFile(transformerOptions.configFile, 'utf-8')
  ]).then(([input, matching]: [string, string]): void => {
    const lieuxDeMediationNumerique: LieuMediationNumerique[] = JSON.parse(input)
      .map(flatten)
      .map(toLieuxMediationNumerique(matching, transformerOptions.sourceName, REPORT))
      .filter(validValuesOnly);

    writeOutputFiles({
      path: transformerOptions.outputDirectory,
      name: transformerOptions.sourceName,
      territoire: transformerOptions.territory
    })(lieuxDeMediationNumerique);
  });
};
