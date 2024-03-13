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
import { DataSource, LieuxMediationNumeriqueMatching, toLieuxMediationNumerique, validValuesOnly } from '../../input';
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

/* eslint-disable-next-line @typescript-eslint/no-restricted-imports, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const LIEUX_MEDIATION_NUMERIQUE_BLACKLIST: LieuxMediationNumeriqueBlacklisted[] = require('../../../../assets/lieuxMediationNumerique.blacklist.json');

const replaceNullWithEmptyString = (jsonString: string): string => {
  const replacer = (_: string, values?: string): string => values ?? '';
  return JSON.stringify(JSON.parse(jsonString), replacer);
};

const lieuxToTransform = (sourceItems: DataSource[], diffSinceLastTransform: DiffSinceLastTransform): DataSource[] =>
  canTransform(diffSinceLastTransform) ? diffSinceLastTransform.toUpsert : sourceItems;

const nothingToTransform = (itemsToTransform: DiffSinceLastTransform): boolean =>
  canTransform(itemsToTransform) && itemsToTransform.toDelete.length === 0 && itemsToTransform.toUpsert.length === 0;

const sourceItemsToDelete = (
  sourceItems: DataSource[],
  lieuxMediationNumeriqueBlacklisted: LieuxMediationNumeriqueBlacklisted[],
  matching: LieuxMediationNumeriqueMatching
): DataSource[] =>
  sourceItems.filter(
    (sourceItem: DataSource): boolean =>
      matching.id != null &&
      !lieuxMediationNumeriqueBlacklisted
        .map((lieu: LieuxMediationNumeriqueBlacklisted): string => lieu.id)
        .includes((sourceItem[matching.id.colonne] as string).toString())
  );

/* eslint-disable-next-line max-statements, max-lines-per-function */
export const transformerAction = async (transformerOptions: TransformerOptions): Promise<void> => {
  const maxTransform: number | undefined = process.env['MAX_TRANSFORM'] == null ? undefined : +process.env['MAX_TRANSFORM'];

  const source: string = await sourceATransformer(transformerOptions);

  const previousSourceHash: string | undefined = (await sourcesFromCartographieNationaleApi(transformerOptions)).get(
    transformerOptions.sourceName
  );
  const sourceHash: string = createHash('sha256').update(source).digest('hex');

  const lieuxMediationNumeriqueBlacklistedFiltered: LieuxMediationNumeriqueBlacklisted[] =
    LIEUX_MEDIATION_NUMERIQUE_BLACKLIST.filter(
      (lieu: LieuxMediationNumeriqueBlacklisted): boolean => lieu.source === transformerOptions.sourceName
    );

  const lieuxBlacklistHash: string = createHash('sha256')
    .update(JSON.stringify(lieuxMediationNumeriqueBlacklistedFiltered))
    .digest('hex');

  const combinedHash: string = createHash('sha256')
    .update(sourceHash + lieuxBlacklistHash)
    .digest('hex');

  if (previousSourceHash === combinedHash) return;

  const repository: TransformationRepository = await transformationRespository(transformerOptions);

  const sourceItems: DataSource[] = sourceItemsToDelete(
    JSON.parse(replaceNullWithEmptyString(source)).slice(0, maxTransform),
    lieuxMediationNumeriqueBlacklistedFiltered,
    repository.config
  );

  const diffSinceLastTransform: DiffSinceLastTransform = repository.diffSinceLastTransform(sourceItems);

  if (nothingToTransform(diffSinceLastTransform)) return;

  const lieux: DataSource[] = lieuxToTransform(sourceItems, diffSinceLastTransform);

  const lieuxDeMediationNumerique: LieuMediationNumerique[] = (
    await Promise.all(lieux.map(flatten).map(toLieuxMediationNumerique(repository, transformerOptions.sourceName, REPORT)))
  ).filter(validValuesOnly);

  /* eslint-disable-next-line no-console */
  diffSinceLastTransform != null && console.log('Nouveaux lieux à ajouter :', diffSinceLastTransform.toUpsert.length);
  /* eslint-disable-next-line no-console */
  diffSinceLastTransform != null && console.log('Lieux à supprimer :', diffSinceLastTransform.toDelete.length);

  repository.saveErrors(REPORT);

  await repository.saveOutputs(lieuxDeMediationNumerique);

  await repository.saveFingerprints(diffSinceLastTransform);

  if (transformerOptions.cartographieNationaleApiKey == null) return;

  await updateSourceWithCartographieNationaleApi(transformerOptions)(combinedHash);

  const lieuxToPublish: LieuMediationNumerique[] = (
    await paginate<SchemaLieuMediationNumerique>(
      `${transformerOptions.cartographieNationaleApiUrl}/lieux-inclusion-numerique/with-duplicates?page[number]=0&page[size]=10000`,
      `source[eq]=${transformerOptions.sourceName}&mergedIds[exists]=false`
    )
  ).map(fromSchemaLieuDeMediationNumerique);

  await saveOutputsInFiles(transformerOptions)(lieuxToPublish);
};
