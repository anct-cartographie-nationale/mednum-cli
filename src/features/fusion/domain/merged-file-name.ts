import type { FilesToMerge } from './files-to-merge';

const ADDRESSES_SOURCE_PATTERN: RegExp = /-addresses\.json$/;

const MERGED_ADDRESSES_FILE_NAME = 'addresses.json';

/**
 * Les fichiers d'adresses alimentent un cache cumulatif : leur fusion s'ajoute au contenu déjà
 * présent dans le fichier de sortie, là où toute autre fusion le remplace.
 */
export const appendsToMergedFile = ({ format, paths }: FilesToMerge): boolean =>
  format === '.json' && ADDRESSES_SOURCE_PATTERN.test(paths[0]);

export const mergedFileName = (filesToMerge: FilesToMerge): string =>
  appendsToMergedFile(filesToMerge) ? MERGED_ADDRESSES_FILE_NAME : `merged_output${filesToMerge.format}`;
