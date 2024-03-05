import {
  fromSchemaLieuDeMediationNumerique,
  LieuMediationNumerique,
  SchemaLieuMediationNumerique
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { createHash } from 'crypto';
import { paginate } from '../../../common';
import {
  saveOutputsInFiles,
  sourceATransformer,
  sourcesFromCartographieNationaleApi,
  updateSourceWithCartographieNationaleApi
} from '../../data';
import { DataSource, toLieuxMediationNumerique, validValuesOnly } from '../../input';
import { Report } from '../../report';
import { TransformationRepository } from '../../repositories';
import { canTransform, DiffSinceLastTransform } from '../diff-since-last-transform';
import { TransformerOptions } from '../transformer-options';
import { transformationRespository } from './transformation.respository';

type LieuxMediationNumeriqueBlacklisted = {
  id: string;
  source: string;
};

/* eslint-disable-next-line @typescript-eslint/no-restricted-imports, @typescript-eslint/naming-convention, @typescript-eslint/typedef, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const flatten = require('flat');

const REPORT: Report = Report();

const lieuxMediationNumeriqueBlacklist = require('../../../../assets/lieuxMediationNumerique.blacklist.json');

const replaceNullWithEmptyString = (jsonString: string): string => {
  const replacer = (_: string, values?: string): string => values ?? '';
  return JSON.stringify(JSON.parse(jsonString), replacer);
};

const lieuxToTransform = (sourceItems: DataSource[], diffSinceLastTransform: DiffSinceLastTransform): DataSource[] =>
  canTransform(diffSinceLastTransform) ? diffSinceLastTransform.toUpsert : sourceItems;

const nothingToTransform = (itemsToTransform: DiffSinceLastTransform): boolean =>
  canTransform(itemsToTransform) && itemsToTransform.toDelete.length === 0 && itemsToTransform.toUpsert.length === 0;

const lieuxMediationNumeriqueToDelete = (lieuDeMediationNumerique: LieuMediationNumerique): boolean =>
  !lieuxMediationNumeriqueBlacklist.some((lieu: LieuxMediationNumeriqueBlacklisted) =>
    lieu.id.includes(`${lieuDeMediationNumerique.source?.replace(/\s/g, '-')}_${lieuDeMediationNumerique.id}`)
  );

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

  const repository: TransformationRepository = await transformationRespository(transformerOptions);

  const diffSinceLastTransform: DiffSinceLastTransform = repository.diffSinceLastTransform(sourceItems);

  if (nothingToTransform(diffSinceLastTransform)) return;

  const lieux: DataSource[] = lieuxToTransform(sourceItems, diffSinceLastTransform);

  const lieuxDeMediationNumerique: LieuMediationNumerique[] = (
    await Promise.all(lieux.map(flatten).map(toLieuxMediationNumerique(repository, transformerOptions.sourceName, REPORT)))
  )
    .filter(validValuesOnly)
    .filter(lieuxMediationNumeriqueToDelete);

  /* eslint-disable-next-line no-console */
  diffSinceLastTransform != null && console.log('Nouveaux lieux à ajouter :', diffSinceLastTransform.toUpsert.length);
  /* eslint-disable-next-line no-console */
  diffSinceLastTransform != null && console.log('Lieux à supprimer :', diffSinceLastTransform.toDelete.length);

  repository.saveErrors(REPORT);

  await repository.saveOutputs(lieuxDeMediationNumerique);

  await repository.saveFingerprints(diffSinceLastTransform);

  if (transformerOptions.cartographieNationaleApiKey == null) return;

  await updateSourceWithCartographieNationaleApi(transformerOptions)(sourceHash);

  const lieuxToPublish: LieuMediationNumerique[] = (
    await paginate<SchemaLieuMediationNumerique>(
      `${transformerOptions.cartographieNationaleApiUrl}/lieux-inclusion-numerique/with-duplicates?page[number]=0&page[size]=10000`,
      `source[eq]=${transformerOptions.sourceName}&mergedIds[exists]=false`
    )
  ).map(fromSchemaLieuDeMediationNumerique);

  await saveOutputsInFiles(transformerOptions)(lieuxToPublish);
};
