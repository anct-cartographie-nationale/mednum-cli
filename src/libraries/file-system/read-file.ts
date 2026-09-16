import * as fs from 'node:fs';

export const readTextFile = async (filePath: string): Promise<string> => fs.promises.readFile(filePath, 'utf-8');

export const readTextFileSync = (filePath: string): string => fs.readFileSync(filePath, 'utf-8');

/**
 * Le contenu d'un fichier JSON, sans rien en affirmer : c'est à l'appelant de dire ce qu'il
 * attend, et ce faisant de le rendre visible. Un fichier manquant ou illisible lève.
 */
export const readJsonFile = (filePath: string): unknown => JSON.parse(readTextFileSync(filePath));

/**
 * Le même, pour les fichiers dont l'absence est un cas ordinaire et non une erreur : un cache
 * qui n'a pas encore été écrit, des métadonnées qu'il n'y avait rien à produire.
 *
 * L'absence rend `undefined`, un contenu illisible lève toujours. Distinguer les deux est
 * l'objet même de cette fonction : les confondre revient à taire une donnée corrompue.
 */
export const readJsonFileIfExists = (filePath: string): unknown =>
  fs.existsSync(filePath) ? readJsonFile(filePath) : undefined;
