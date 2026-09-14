import { inject } from '../../../../libraries/injection/index.js';
import { joinPath } from '../../../../libraries/file-system/path.js';
import { appendsToMergedFile, type FilesToMerge, filesToMerge, type MergeFormat, mergedFileName } from '../../domain/index.js';
import { LIST_FILES, READ_RECORDS, WRITE_RECORDS } from '../../keys/index.js';

export type FusionnerDesFichiers = {
  inputFilesPattern: string;
  outputDirectory: string;
};

export type FichiersFusionnes = {
  format: MergeFormat;
  mergedFilePath: string;
  mergedFilesCount: number;
};

const recordsAlreadyMerged = (filesToMerge: FilesToMerge, mergedFilePath: string): unknown[] =>
  appendsToMergedFile(filesToMerge) ? inject(READ_RECORDS)('.json')(mergedFilePath) : [];

export const fusionnerDesFichiers = ({ inputFilesPattern, outputDirectory }: FusionnerDesFichiers): FichiersFusionnes => {
  const files: FilesToMerge = filesToMerge(inject(LIST_FILES)(inputFilesPattern));
  const mergedFilePath: string = joinPath(outputDirectory, mergedFileName(files));

  const records: unknown[] = [
    ...recordsAlreadyMerged(files, mergedFilePath),
    ...files.paths.flatMap(inject(READ_RECORDS)(files.format))
  ];

  inject(WRITE_RECORDS)(files.format)(mergedFilePath, records);

  return { format: files.format, mergedFilePath, mergedFilesCount: files.paths.length };
};
