export type SourceContent = {
  next?: string;
};

/**
 * Extrait les enregistrements du contenu récupéré : toutes les valeurs de l'objet, ou celles
 * de la seule propriété désignée par la clé.
 */
const NEXT_PAGE_PROPERTY = 'next';

const isRecord = ([property]: [string, unknown]): boolean => property !== NEXT_PAGE_PROPERTY;

export const recordsOf = <T>(content: Record<string, T>, key?: string): T[] =>
  key == null
    ? Object.entries(content)
        .filter(isRecord)
        .map(([, value]: [string, T]): T => value)
    : Object.values(content[key] ?? {});
