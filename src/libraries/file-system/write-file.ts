import * as fs from 'node:fs';

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

export const writeTextFileSync = (filePath: string, content: string): void => fs.writeFileSync(filePath, content, 'utf-8');
