import { inject } from '../../../../libraries/injection';
import { joinPath } from '../../../../libraries/file-system/path';
import { appendsToMergedFile, type FilesToMerge, filesToMerge, type MergeFormat, mergedFileName } from '../../domain';
import { LIST_FILES, MERGE_DUPLICATES, READ_MERGED_RECORDS, READ_RECORDS, WRITE_RECORDS } from '../../keys';

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
  appendsToMergedFile(filesToMerge) ? inject(READ_MERGED_RECORDS)(mergedFilePath) : [];

export const fusionnerDesFichiers = ({ inputFilesPattern, outputDirectory }: FusionnerDesFichiers): FichiersFusionnes => {
  const files: FilesToMerge = filesToMerge(inject(LIST_FILES)(inputFilesPattern));
  const mergedFilePath: string = joinPath(outputDirectory, mergedFileName(files));

  const records: unknown[] = [
    ...recordsAlreadyMerged(files, mergedFilePath),
    ...files.paths.flatMap(inject(READ_RECORDS)(files.format))
  ];

  inject(WRITE_RECORDS)(files.format)(mergedFilePath, appendsToMergedFile(files) ? inject(MERGE_DUPLICATES)(records) : records);

  return { format: files.format, mergedFilePath, mergedFilesCount: files.paths.length };
};
