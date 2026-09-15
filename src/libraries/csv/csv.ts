import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

/**
 * Lecture et écriture de CSV tabulaire, première ligne en en-tête. Isolé ici pour que les
 * capacités composent leur chargement sans choisir elles-mêmes de bibliothèque CSV.
 */

export type CsvRecord = Record<string, string>;

export const parseCsvRecords = <T = CsvRecord>(text: string, delimiter?: string): T[] =>
  parse(text, { columns: true, ...(delimiter == null ? {} : { delimiter }) }) as T[];

export const toCsvText = (records: unknown[]): string => stringify(records, { header: true });

/**
 * Une colonne vide vaut absence de valeur : le CSV ne distingue pas la chaîne vide du champ
 * non renseigné, alors que les schémas en aval attendent une propriété absente.
 */
export const withoutEmptyFields = (record: CsvRecord): CsvRecord =>
  Object.fromEntries(
    Object.entries(record).filter(([, field]: [string, string | null]): boolean => field !== '' && field != null)
  );
