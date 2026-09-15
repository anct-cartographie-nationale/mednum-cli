import * as fs from 'node:fs';

export const readTextFile = async (filePath: string): Promise<string> => fs.promises.readFile(filePath, 'utf-8');

export const readTextFileSync = (filePath: string): string => fs.readFileSync(filePath, 'utf-8');
