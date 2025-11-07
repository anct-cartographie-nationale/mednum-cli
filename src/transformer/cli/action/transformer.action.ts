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
import { AddressCache, AddressRecord } from '../../storage';
import { TransformationRepository } from '../../repositories';
import { canTransform, DiffSinceLastTransform } from '../diff-since-last-transform';
import { TransformerOptions } from '../transformer-options';
import { transformationRespository } from './transformation.respository';
import addressesBan from '../../../../assets/input/addresses.json';
import { label } from '../../data/localisation/localisation-from-geo';

const REPORT: Report = Report();
const ADDRESSESCACHE: AddressCache = AddressCache();
const BATCH_SIZE = 50;
const PAUSE_MS = 1000;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

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
  const lieuxDeMediationNumerique: LieuMediationNumerique[] = [];
  for (let i = 0; i < lieux.length; i += BATCH_SIZE) {
    const batch = lieux.slice(i, i + BATCH_SIZE);
    const adressesOriginaleMatching: boolean[] = batch.map((lieu) =>
      (addressesBan as unknown as AddressRecord[]).find(
        (storage: AddressRecord) => label(lieu, repository.config) === storage?.addresseOriginale
      )
        ? true
        : false
    );

    const result = await Promise.all(
      batch
        .map((dataSource: DataSource) => flatten(dataSource, { safe: isFlatten(repository.config) }))
        .map((lieu, index) =>
          toLieuxMediationNumerique(repository, transformerOptions.sourceName, REPORT, ADDRESSESCACHE)(lieu, i + index)
        )
    );

    lieuxDeMediationNumerique.push(...result.filter(validValuesOnly));
    if ((adressesOriginaleMatching.filter(Boolean).length / batch.length) * 100 >= 50) continue;
    if (i + BATCH_SIZE < lieux.length) await delay(PAUSE_MS);
  }

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
  console.log("7. Sauvegarde de l'historique: +", ADDRESSESCACHE.records().length);
  repository.saveAddresses(ADDRESSESCACHE);

  if (transformerOptions.force) return;

  console.log('8. Sauvegarde des empruntes');
  await repository.saveFingerprints(diffSinceLastTransform);

  if (transformerOptions.cartographieNationaleApiKey == null) return;

  console.log('9. Sauvegarde du hash de la source');
  await updateSourceWithCartographieNationaleApi(transformerOptions)(sourceHash);

  const lieuxToPublish: LieuMediationNumerique[] = (
    await paginate<SchemaLieuMediationNumerique>(
      `${transformerOptions.cartographieNationaleApiUrl}/lieux-inclusion-numerique/with-duplicates?page[number]=0&page[size]=10000`,
      `source[eq]=${transformerOptions.sourceName}&mergedIds[exists]=false`
    )
  ).map(fromSchemaLieuDeMediationNumerique);

  console.log('10. Sauvegarde des fichiers de sortie');
  await saveOutputsInFiles(transformerOptions)(lieuxToPublish);
};
