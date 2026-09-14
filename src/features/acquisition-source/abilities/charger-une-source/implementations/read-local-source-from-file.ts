import * as fs from 'node:fs';
import type { SourceLocation } from '../domain/index.js';
import type { ReadLocalSource } from '../keys/index.js';

export const readLocalSourceFromFile: ReadLocalSource = async ({ source }: SourceLocation): Promise<Record<string, unknown>> =>
  JSON.parse(await fs.promises.readFile(source, 'utf-8'));
