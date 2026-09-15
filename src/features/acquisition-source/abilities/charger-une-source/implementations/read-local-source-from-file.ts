import { readJsonFile } from '../../../../../libraries/file-system';
import type { SourceLocation } from '../domain';
import type { ReadLocalSource } from '../keys';

export const readLocalSourceFromFile: ReadLocalSource = async ({ source }: SourceLocation): Promise<Record<string, unknown>> =>
  readJsonFile(source) as Record<string, unknown>;
