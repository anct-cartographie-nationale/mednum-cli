import * as fs from 'fs';

export const throwWriteFileError = (writeFileError: unknown): void => {
  if (writeFileError instanceof Error) {
    throw writeFileError;
  }
};

export const noEmptyCell = <T>(_: string, cell: T): T | undefined => (cell === '' ? undefined : cell);

export const createFolderIfNotExist = (folderPath: string): string => {
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

  return folderPath;
};
