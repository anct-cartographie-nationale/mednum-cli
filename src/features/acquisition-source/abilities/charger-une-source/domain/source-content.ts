export type SourceContent = {
  next?: string;
};

/**
 * Extrait les enregistrements du contenu récupéré : toutes les valeurs de l'objet, ou celles
 * de la seule propriété désignée par la clé.
 */
export const recordsOf = <T>(content: Record<string, T>, key?: string): T[] =>
  key == null ? Object.values(content) : Object.values(content[key] ?? {});
