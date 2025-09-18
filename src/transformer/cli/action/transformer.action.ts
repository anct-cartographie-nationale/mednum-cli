import { flatten } from 'flat';
import {
  fromSchemaLieuDeMediationNumerique,
  LieuMediationNumerique,
  SchemaLieuMediationNumerique
} from '@gouvfr-anct/lieux-de-mediation-numerique';
import { createHash } from 'node:crypto';
import { paginate } from '../../../common';
import {
  saveOutputsInFiles,
  sourceATransformer,
  sourcesFromCartographieNationaleApi,
  updateSourceWithCartographieNationaleApi
} from '../../data';
import { DataSource, toLieuxMediationNumerique, validValuesOnly, isFlatten } from '../../input';
import { Report } from '../../report';
import { TransformationRepository } from '../../repositories';
import { canTransform, DiffSinceLastTransform } from '../diff-since-last-transform';
import { TransformerOptions } from '../transformer-options';
import { transformationRespository } from './transformation.respository';

const REPORT: Report = Report();

const replaceNullWithEmptyString = (jsonString: string): string => {
  const replacer = (_: string, values?: string): string => values ?? '';
  return JSON.stringify(JSON.parse(jsonString), replacer);
};

const lieuxToTransform = (sourceItems: DataSource[], diffSinceLastTransform: DiffSinceLastTransform): DataSource[] =>
  canTransform(diffSinceLastTransform) ? diffSinceLastTransform.toUpsert : sourceItems;

const nothingToTransform = (itemsToTransform: DiffSinceLastTransform): boolean =>
  canTransform(itemsToTransform) && itemsToTransform.toDelete.length === 0 && itemsToTransform.toUpsert.length === 0;

const shouldAbortWhenHashIsUnchanged =
  (transformerOptions: TransformerOptions) =>
  async (sourceHash: string): Promise<boolean> => {
    if (transformerOptions.force) {
      console.log('1. La vérification de la différence par rapport au hash de la transformation précédente est désactivée');
      return false;
    }
    console.log('1. Vérification de la différence par rapport au hash de la transformation précédente');

    if ((await sourcesFromCartographieNationaleApi(transformerOptions)).get(transformerOptions.sourceName) === sourceHash) {
      console.log("2. Il n'y a pas de différence par rapport à la transformation précédente");
      return true;
    }

    return false;
  };

export const transformerAction = async (transformerOptions: TransformerOptions): Promise<void> => {
  const maxTransform: number | undefined = process.env['MAX_TRANSFORM'] == null ? undefined : +process.env['MAX_TRANSFORM'];

  const source: string = await sourceATransformer(transformerOptions);
  const sourceHash: string = createHash('sha256').update(source).digest('hex');

  if (await shouldAbortWhenHashIsUnchanged(transformerOptions)(sourceHash)) return;

  const sourceItems: DataSource[] = JSON.parse(replaceNullWithEmptyString(source)).slice(0, maxTransform);

  console.log('2. Initialisation des services tiers');
  const repository: TransformationRepository = await transformationRespository(transformerOptions);

  console.log('3. Calcul de la différence depuis la dernière transformation');
  const diffSinceLastTransform: DiffSinceLastTransform = repository.diffSinceLastTransform(sourceItems);

  if (nothingToTransform(diffSinceLastTransform)) {
    console.log("4. Il n'y a rien à transformer");
    return;
  }

  const lieux: DataSource[] = lieuxToTransform(sourceItems, diffSinceLastTransform);

  console.log('4. Transformation des données vers le schéma des lieux de mediation numérique');
  const lieuxDeMediationNumerique: LieuMediationNumerique[] = (
    await Promise.all(
      lieux
        .map((dataSource: DataSource) => flatten(dataSource, { safe: isFlatten(repository.config) }))
        .map(toLieuxMediationNumerique(repository, transformerOptions.sourceName, REPORT))
    )
  ).filter(validValuesOnly);

  if (diffSinceLastTransform != null) {
    console.log('Lieux à ajouter :', diffSinceLastTransform.toUpsert.length);
    console.log('Lieux à supprimer :', diffSinceLastTransform.toDelete.length);
  }
  console.log("5. Sauvegarde du rapport d'erreur", REPORT.records().length);
  repository.saveErrors(REPORT);
  console.log(
    '6. Sauvegarde des sorties : ',
    lieuxDeMediationNumerique.length,
    '(dont lieux sans localisation : ',
    lieuxDeMediationNumerique.filter((l) => !l.localisation).length,
    ')'
  );
  await repository.saveOutputs(lieuxDeMediationNumerique);

  if (transformerOptions.force) return;

  console.log('7. Sauvegarde des empruntes');
  await repository.saveFingerprints(diffSinceLastTransform);

  if (transformerOptions.cartographieNationaleApiKey == null) return;

  console.log('8. Sauvegarde du hash de la source');
  await updateSourceWithCartographieNationaleApi(transformerOptions)(sourceHash);

  const lieuxToPublish: LieuMediationNumerique[] = (
    await paginate<SchemaLieuMediationNumerique>(
      `${transformerOptions.cartographieNationaleApiUrl}/lieux-inclusion-numerique/with-duplicates?page[number]=0&page[size]=10000`,
      `source[eq]=${transformerOptions.sourceName}&mergedIds[exists]=false`
    )
  ).map(fromSchemaLieuDeMediationNumerique);

  console.log('9. Sauvegarde des fichiers de sortie');
  await saveOutputsInFiles(transformerOptions)(lieuxToPublish);
};
