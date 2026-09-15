import { readJsonFile } from '../../../../../libraries/file-system/index.js';
import type { SourceLocation } from '../domain/index.js';
import type { ReadLocalSource } from '../keys/index.js';

export const readLocalSourceFromFile: ReadLocalSource = async ({ source }: SourceLocation): Promise<Record<string, unknown>> =>
  readJsonFile(source) as Record<string, unknown>;
