import * as fs from 'node:fs';
import type { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { parse } from 'csv-parse/sync';
import { glob } from 'glob';
import { paginate } from '../../../libraries/http/index.js';
import type { LoadLieux } from '../domain/index.js';

const readJsonFile = (filePath: string): SchemaLieuMediationNumerique[] => JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const removeEmptyValue = (record: Record<string, string>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(record).filter(([, field]: [string, string | null]): boolean => field !== '' && field != null)
  );

const readCsvFile = (filePath: string): SchemaLieuMediationNumerique[] =>
  (parse(fs.readFileSync(filePath, 'utf-8'), { columns: true }) as Record<string, string>[]).map(
    removeEmptyValue
  ) as unknown as SchemaLieuMediationNumerique[];

type SourceLoader = {
  selector: (source: string) => boolean;
  loader: (source: string) => Promise<SchemaLieuMediationNumerique[]> | SchemaLieuMediationNumerique[];
};

const SOURCE_LOADERS: SourceLoader[] = [
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

export const loadLieuxFromSource: LoadLieux = async (source: string): Promise<SchemaLieuMediationNumerique[]> => {
  const sourceLoader: SourceLoader | undefined = SOURCE_LOADERS.find(({ selector }: SourceLoader): boolean => selector(source));

  if (sourceLoader == null) throw new Error(`Format de source non pris en charge : ${source}`);

  return sourceLoader.loader(source);
};
