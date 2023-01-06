/* eslint-disable-next-line @typescript-eslint/no-restricted-imports */
import * as fs from 'fs';
import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Report } from '../../report';
import { toLieuxMediationNumerique, validValuesOnly } from '../../input';
import { writeOutputFiles } from '../../output';
import { TransformerOptions } from '../transformer-options';

const REPORT: Report = Report();

export const transformerAction = async (transformerOptions: TransformerOptions): Promise<void> => {
  await Promise.all([
    fs.promises.readFile(transformerOptions.sourceFile, 'utf-8'),
    fs.promises.readFile(transformerOptions.configFile, 'utf-8')
  ]).then(([dataString, matching]: [string, string]): void => {
    const lieuxDeMediationNumerique: LieuMediationNumerique[] = JSON.parse(dataString)
      .map(toLieuxMediationNumerique(matching, transformerOptions.sourceName, REPORT))
      .filter(validValuesOnly);

    writeOutputFiles({
      path: transformerOptions.outputDirectory,
      name: transformerOptions.sourceName.toLowerCase().replace(/\s/gu, '-'),
      territoire: transformerOptions.territory.toLowerCase().replace(/\s/gu, '-')
    })(lieuxDeMediationNumerique);
  });
};
