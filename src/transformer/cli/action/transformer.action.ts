import { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { createHash } from 'crypto';
import { sourceATransformer, sourcesFromCartographieNationaleApi, updateSourceWithCartographieNationaleApi } from '../../data';
import { DataSource, toLieuxMediationNumerique, validValuesOnly } from '../../input';
import { Report } from '../../report';
import { LieuxDeMediationNumeriqueTransformationRepository } from '../../repositories';
import { canTransform, DiffSinceLastTransform } from '../diff-since-last-transform';
import { TransformerOptions } from '../transformer-options';
import { lieuxDeMediationNumeriqueTransformation } from './lieux-inclusion-numerique-transformation';

/* eslint-disable-next-line @typescript-eslint/no-restricted-imports, @typescript-eslint/naming-convention, @typescript-eslint/typedef, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const flatten = require('flat');

const REPORT: Report = Report();

const replaceNullWithEmptyString = (jsonString: string): string => {
  const replacer = (_: string, values?: string): string => values ?? '';
  return JSON.stringify(JSON.parse(jsonString), replacer);
};

const lieuxToTransform = (sourceItems: DataSource[], diffSinceLastTransform: DiffSinceLastTransform): DataSource[] =>
  canTransform(diffSinceLastTransform) ? diffSinceLastTransform.toUpsert : sourceItems;

const nothingToTransform = (itemsToTransform: DiffSinceLastTransform): boolean =>
  canTransform(itemsToTransform) && itemsToTransform.toDelete.length === 0 && itemsToTransform.toUpsert.length === 0;

/* eslint-disable-next-line max-statements, max-lines-per-function */
export const transformerAction = async (transformerOptions: TransformerOptions): Promise<void> => {
  const maxTransform: number | undefined = process.env['MAX_TRANSFORM'] == null ? undefined : +process.env['MAX_TRANSFORM'];

  const source: string = await sourceATransformer(transformerOptions);

  const previousSourceHash: string | undefined = (await sourcesFromCartographieNationaleApi(transformerOptions)).get(
    transformerOptions.sourceName
  );
  const sourceHash: string = createHash('sha256').update(source).digest('hex');
  if (previousSourceHash === sourceHash) return;

  const sourceItems: DataSource[] = JSON.parse(replaceNullWithEmptyString(source)).slice(0, maxTransform);

  const repository: LieuxDeMediationNumeriqueTransformationRepository = await lieuxDeMediationNumeriqueTransformation(
    transformerOptions
  );

  const diffSinceLastTransform: DiffSinceLastTransform = repository.diffSinceLastTransform(sourceItems);
  const lieux: DataSource[] = lieuxToTransform(sourceItems, diffSinceLastTransform);

  if (nothingToTransform(diffSinceLastTransform)) return;

  const lieuxDeMediationNumerique: LieuMediationNumerique[] = lieux
    .map(flatten)
    .map(toLieuxMediationNumerique(repository, transformerOptions.sourceName, REPORT))
    .filter(validValuesOnly);

  repository.saveErrors(REPORT);
  await repository.saveOutputs(lieuxDeMediationNumerique);
  await repository.saveFingerprints(diffSinceLastTransform);

  transformerOptions.cartographieNationaleApiKey != null &&
    (await updateSourceWithCartographieNationaleApi(transformerOptions)(sourceHash));
};
