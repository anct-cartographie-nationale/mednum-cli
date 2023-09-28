import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { createHash } from 'crypto';
import { sourceATransformer, sourcesFromCartographieNationaleApi } from '../../data';
import { toLieuxMediationNumerique, validValuesOnly } from '../../input';
import { writeErrorsOutputFiles, writeOutputFiles } from '../../output';
import { Report } from '../../report';
import { LieuxDeMediationNumeriqueTransformationRepository } from '../../repositories';
import { TransformerOptions } from '../transformer-options';
import { keepOneEntryPerSource } from './duplicates-same-source/duplicates-same-source';
import { lieuxDeMediationNumeriqueTransformation } from './lieux-inclusion-numerique-transformation';

/* eslint-disable-next-line @typescript-eslint/no-restricted-imports, @typescript-eslint/naming-convention, @typescript-eslint/typedef, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const flatten = require('flat');

const REPORT: Report = Report();

const replaceNullWithEmptyString = (jsonString: string): string => {
  const replacer = (_: string, values?: string): string => values ?? '';
  return JSON.stringify(JSON.parse(jsonString), replacer);
};

const toLieuById = (
  lieuxById: Record<string, LieuMediationNumerique>,
  lieu: LieuMediationNumerique
): Record<string, LieuMediationNumerique> => ({ ...lieuxById, [lieu.id]: lieu });

const shouldAbortTransform = async (source: string, transformerOptions: TransformerOptions): Promise<boolean> => {
  const previousSourceHash: string | undefined = (await sourcesFromCartographieNationaleApi()).get(
    transformerOptions.sourceName
  );
  const sourceHash: string = createHash('sha256').update(source).digest('hex');

  return previousSourceHash === sourceHash;
};

export const transformerAction = async (transformerOptions: TransformerOptions): Promise<void> => {
  const source: string = await sourceATransformer(transformerOptions);

  if (await shouldAbortTransform(source, transformerOptions)) return;

  const lieuxDeMediationNumeriqueTransformationRepository: LieuxDeMediationNumeriqueTransformationRepository =
    await lieuxDeMediationNumeriqueTransformation(transformerOptions);

  const lieuxDeMediationNumeriqueFiltered: Record<string, LieuMediationNumerique> = JSON.parse(
    replaceNullWithEmptyString(source)
  )
    .map(flatten)
    .map(toLieuxMediationNumerique(lieuxDeMediationNumeriqueTransformationRepository, transformerOptions.sourceName, REPORT))
    .filter(validValuesOnly)
    .reduce(toLieuById, {});

  writeErrorsOutputFiles({
    path: transformerOptions.outputDirectory,
    name: transformerOptions.sourceName,
    territoire: transformerOptions.territory
  })(REPORT);

  writeOutputFiles({
    path: transformerOptions.outputDirectory,
    name: transformerOptions.sourceName,
    territoire: transformerOptions.territory
  })(keepOneEntryPerSource(Object.values(lieuxDeMediationNumeriqueFiltered)));
};
