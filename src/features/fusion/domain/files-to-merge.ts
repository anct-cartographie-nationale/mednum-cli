import { extensionOf } from '../../../libraries/file-system/path.js';
import { hasFormat, type MergeFormat, mergeFormatOf } from './merge-format.js';
import { MERGE_ERROR_MESSAGES, MergeError } from './merge.error.js';

export type FilesToMerge = {
  format: MergeFormat;
  paths: [string, ...string[]];
};

const atLeastOneFileIn = (filePaths: string[]): filePaths is [string, ...string[]] => filePaths.length !== 0;

/**
 * Valide qu'un ensemble de chemins forme un lot fusionnable : non vide, d'un format pris en
 * charge, et homogène. Le format du lot est celui du premier fichier.
 */
export const filesToMerge = (filePaths: string[]): FilesToMerge => {
  if (!atLeastOneFileIn(filePaths)) throw new MergeError(MERGE_ERROR_MESSAGES.NO_FILE_FOUND);

  const format: MergeFormat | undefined = mergeFormatOf(filePaths[0]);

  if (format == null) throw new MergeError(MERGE_ERROR_MESSAGES.UNSUPPORTED_FORMAT(extensionOf(filePaths[0])));

  if (!filePaths.every(hasFormat(format))) throw new MergeError(MERGE_ERROR_MESSAGES.MIXED_FORMATS);

  return { format, paths: filePaths };
};
