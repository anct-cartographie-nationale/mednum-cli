import { type InjectionKey, keyFor } from '../../../libraries/injection';

export type ReadMergedRecords = (filePath: string) => unknown[];

/**
 * Lire le cumul déjà constitué n'obéit pas à la même politique que lire un fichier d'entrée :
 * une entrée manquante est une erreur, un cumul manquant est un premier tour. Les deux contrats
 * restent donc distincts, chacun nommant sa politique.
 */
export const READ_MERGED_RECORDS: InjectionKey<ReadMergedRecords> = keyFor<ReadMergedRecords>('fusion.read-merged-records');
