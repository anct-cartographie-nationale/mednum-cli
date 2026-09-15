import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

/**
 * Lecture et écriture de CSV tabulaire, première ligne en en-tête. Isolé ici pour que les
 * capacités composent leur chargement sans choisir elles-mêmes de bibliothèque CSV.
 */

/**
 * Un CSV ne rend que du texte. `T` est contraint par cette vérité : un appelant peut nommer
 * les colonnes qu'il attend, il ne peut pas prétendre qu'elles portent des nombres.
 * Leur présence, elle, reste une affirmation que rien ne vérifie.
 */
export type CsvRecord = Record<string, string>;

export const parseCsvRecords = <T extends CsvRecord = CsvRecord>(text: string, delimiter?: string): T[] =>
  parse(text, { columns: true, ...(delimiter == null ? {} : { delimiter }) }) as T[];

export const toCsvText = (records: readonly unknown[]): string => stringify(records as unknown[], { header: true });

/**
 * Une colonne vide vaut absence de valeur : le CSV ne distingue pas la chaîne vide du champ
 * non renseigné, alors que les schémas en aval attendent une propriété absente.
 * `csv-parse` ne produit jamais `null` ni `undefined` sous `columns: true` — une ligne trop
 * courte omet la propriété — la chaîne vide est donc le seul cas à écarter.
 */
export const withoutEmptyFields = <T extends CsvRecord>(record: T): CsvRecord =>
  Object.fromEntries(Object.entries(record).filter(([, field]: [string, string]): boolean => field !== ''));
