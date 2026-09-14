import * as path from 'node:path';

/**
 * Manipulation pure de chemins : aucune lecture ni écriture sur le disque.
 * Isolé du reste de `file-system` pour que du code de domaine puisse en dépendre
 * sans embarquer `node:fs` dans son graphe de dépendances.
 */

export const extensionOf = (filePath: string): string => path.extname(filePath).toLowerCase();

export const directoryOf = (filePath: string): string => path.dirname(filePath);

export const joinPath = (...segments: string[]): string => path.join(...segments);
