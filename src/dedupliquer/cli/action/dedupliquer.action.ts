import * as fs from 'node:fs';
import { parse } from 'csv-parse/sync';
import { glob } from 'glob';
import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { paginate } from '../../../common';
import { DeduplicationRepository } from '../../repositories';
import {
  DuplicationComparison,
  duplicationComparisons,
  groupDuplicates,
  Groups,
  MergedLieuxByGroupMap,
  mergeDuplicates
} from '../../steps';
import { DedupliquerOptions } from '../dedupliquer-options';
import { deduplicationRepository } from './deduplication.repository';
import { appendCoopId } from './append-coop-id';

const INTERNAL_DUPLICATION_SCORE_THRESHOLD = 90 as const;
const DUPLICATION_SCORE_THRESHOLD = 83 as const;

const onlyMoreThanDuplicationScoreThreshold =
  (allowInternalMerge: boolean) =>
  (duplicationComparison: DuplicationComparison): boolean =>
    duplicationComparison.score > (allowInternalMerge ? INTERNAL_DUPLICATION_SCORE_THRESHOLD : DUPLICATION_SCORE_THRESHOLD);

const readJsonFile = (filePath: string): SchemaLieuMediationNumerique[] => JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const removeEmptyValue = (record: Record<string, string>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(record).filter(([, field]: [string, string | null]): boolean => field !== '' && field != null)
  );

const readCsvFile = (filePath: string): SchemaLieuMediationNumerique[] =>
  parse(fs.readFileSync(filePath, 'utf-8'), { columns: true }).map(removeEmptyValue) as SchemaLieuMediationNumerique[];

type DataType = {
  selector: (source: string) => boolean;
  loader: (source: string) => Promise<SchemaLieuMediationNumerique[]> | SchemaLieuMediationNumerique[];
};

const DATA_TYPES: DataType[] = [
  {
    selector: (source: string): boolean => source.startsWith('http'),
    loader: async (source: string): Promise<SchemaLieuMediationNumerique[]> =>
      paginate<SchemaLieuMediationNumerique>(`${source.split('?')[0]}?page[number]=0&page[size]=10000`, source.split('?')[1])
  },
  {
    selector: (source: string): boolean => source.endsWith('.json'),
    loader: (source: string): SchemaLieuMediationNumerique[] => readJsonFile(glob.sync(source)[0] ?? source)
  },
  {
    selector: (source: string): boolean => source.endsWith('.csv'),
    loader: (source: string): SchemaLieuMediationNumerique[] => readCsvFile(glob.sync(source)[0] ?? source)
  }
];

const loadData = async (source: string): Promise<SchemaLieuMediationNumerique[]> => {
  const loaderConfig: DataType | undefined = DATA_TYPES.find(({ selector }: DataType): boolean => selector(source));

  if (loaderConfig == null) {
    throw new Error(`Format de source non pris en charge : ${source}`);
  }

  return loaderConfig.loader(source);
};

export const dedupliquerAction = async (dedupliquerOptions: DedupliquerOptions): Promise<void> => {
  try {
    const repository: DeduplicationRepository = deduplicationRepository(dedupliquerOptions);

    console.log('1. chargement des données');
    const lieuxToDeduplicate: SchemaLieuMediationNumerique[] = await loadData(dedupliquerOptions.baseSource);
    const lieuxMediationNumerique: SchemaLieuMediationNumerique[] = await loadData(dedupliquerOptions.source);

    console.log(`2. recherche des doublons parmi les ${lieuxToDeduplicate.length} lieux`);
    const duplications: DuplicationComparison[] = duplicationComparisons(
      lieuxToDeduplicate,
      dedupliquerOptions.allowInternal,
      lieuxMediationNumerique
    );

    const filteredDuplications = duplications.filter(onlyMoreThanDuplicationScoreThreshold(dedupliquerOptions.allowInternal));

    console.log(`3. groupement des doublons selon les ${filteredDuplications.length} groupes identifiés`);
    const groups: Groups = groupDuplicates(filteredDuplications);

    console.log('4. fusion des doublons');
    const merged: MergedLieuxByGroupMap = mergeDuplicates(new Date())(lieuxToDeduplicate, groups);
    console.log('- lieux concernés par une fusion :', groups.itemGroupMap.size);
    console.log('- lieux fusionnés à enregistrer :', merged.size);

    console.log("5. ajout de l'identifiant de de référence de la coop de la médiation numérique");
    const lieuxToDeduplicateWithCoopId: SchemaLieuMediationNumerique[] = lieuxToDeduplicate.map(appendCoopId);

    console.log('6. sauvegarde des données dédupliquées');
    await repository.save(groups, merged, lieuxToDeduplicateWithCoopId, duplications);
  } catch (error) {
    console.log(error);
  }
};
