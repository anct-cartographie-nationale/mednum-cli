import { readJsonFile } from '../../../../../libraries/file-system/index';
import type { SourceLocation } from '../domain/index';
import type { ReadLocalSource } from '../keys/index';

export const readLocalSourceFromFile: ReadLocalSource = async ({ source }: SourceLocation): Promise<Record<string, unknown>> =>
  readJsonFile(source) as Record<string, unknown>;
