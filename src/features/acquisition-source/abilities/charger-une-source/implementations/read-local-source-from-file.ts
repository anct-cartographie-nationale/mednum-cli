import * as fs from 'node:fs';
import type { SourceLocation } from '../domain';
import type { ReadLocalSource } from '../keys';

export const readLocalSourceFromFile: ReadLocalSource = async ({ source }: SourceLocation): Promise<Record<string, unknown>> =>
  JSON.parse(await fs.promises.readFile(source, 'utf-8'));
