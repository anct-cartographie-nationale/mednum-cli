import { glob } from 'glob';

export const findFiles = (pattern: string): string[] => glob.sync(pattern);

/**
 * Premier fichier correspondant au motif. Un chemin littéral est son propre motif : il se
 * trouve lui-même, ce qui permet d'accepter indifféremment un motif ou un chemin.
 */
export const firstFile = (pattern: string): string | undefined => findFiles(pattern)[0];
