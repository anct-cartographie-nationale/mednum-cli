/* eslint-disable no-console */

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

  console.log('1. Initialisation des services tiers');
  const repository: TransformationRepository = await transformationRespository(transformerOptions);

  console.log('2. Calcul de la différence depuis la dernière transformation');
  const diffSinceLastTransform: DiffSinceLastTransform = repository.diffSinceLastTransform(sourceItems);

  if (nothingToTransform(diffSinceLastTransform)) {
    console.log("3. Il n'y a rien à transformer");
    return;
  }

  const lieux: DataSource[] = lieuxToTransform(sourceItems, diffSinceLastTransform);

  console.log('3. Transformation des données vers le schéma des lieux de mediation numérique');
  const lieuxDeMediationNumerique: LieuMediationNumerique[] = (
    await Promise.all(lieux.map(flatten).map(toLieuxMediationNumerique(repository, transformerOptions.sourceName, REPORT)))
  ).filter(validValuesOnly);

  /* eslint-disable-next-line no-console */
  diffSinceLastTransform != null && console.log('Lieux à ajouter :', diffSinceLastTransform.toUpsert.length);
  /* eslint-disable-next-line no-console */
  diffSinceLastTransform != null && console.log('Lieux à supprimer :', diffSinceLastTransform.toDelete.length);

  console.log("4. Sauvegarde du rapport d'erreur");
  repository.saveErrors(REPORT);

  console.log('5. Sauvegarde des sorties');
  await repository.saveOutputs(lieuxDeMediationNumerique);

  console.log('6. Sauvegarde des empruntes');
  await repository.saveFingerprints(diffSinceLastTransform);

  if (transformerOptions.cartographieNationaleApiKey == null) return;

  console.log('7. Sauvegarde du hash de la source');
  await updateSourceWithCartographieNationaleApi(transformerOptions)(sourceHash);

  const lieuxToPublish: LieuMediationNumerique[] = (
    await paginate<SchemaLieuMediationNumerique>(
      `${transformerOptions.cartographieNationaleApiUrl}/lieux-inclusion-numerique/with-duplicates?page[number]=0&page[size]=10000`,
      `source[eq]=${transformerOptions.sourceName}&mergedIds[exists]=false`
    )
  ).map(fromSchemaLieuDeMediationNumerique);

  console.log('8. Sauvegarde des fichiers de sortie');
  await saveOutputsInFiles(transformerOptions)(lieuxToPublish);
};
