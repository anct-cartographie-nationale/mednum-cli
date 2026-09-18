import { globSync } from 'glob';
import { readJsonFileIfExists } from '../../../../../libraries/file-system';
import type { LieuLocalise } from '../domain';
import type { LireLesLieux } from '../keys';

export const lireLesLieuxDepuisDesFichiers: LireLesLieux = (motif: string): LieuLocalise[] =>
  globSync(motif).flatMap((fichier: string): LieuLocalise[] => (readJsonFileIfExists(fichier) ?? []) as LieuLocalise[]);
