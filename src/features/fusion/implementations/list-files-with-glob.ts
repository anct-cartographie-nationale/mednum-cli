import { glob } from 'glob';
import type { ListFiles } from '../keys';

export const listFilesWithGlob: ListFiles = (pattern: string): string[] => glob.sync(pattern);
