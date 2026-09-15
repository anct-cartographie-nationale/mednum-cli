export type SourceContent = {
  next?: string;
};

const NEXT_PAGE_PROPERTY = 'next';

const isNotNextPage = ([property]: [string, unknown]): boolean => property !== NEXT_PAGE_PROPERTY;

/**
 * Un conteneur d'enregistrements : objet ou tableau, jamais une primitive. Le vérifier plutôt
 * que l'affirmer, puisque le contenu vient d'une source étrangère.
 */
const isContainer = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

/**
 * Extrait les enregistrements du contenu récupéré : toutes les valeurs de l'objet, ou celles
 * de la seule propriété désignée par la clé.
 *
 * Le type des enregistrements reste `unknown` : rien ici ne les a inspectés. La capacité qui
 * les a demandés est seule en mesure d'affirmer ce qu'ils sont.
 */
export const recordsOf = (content: Record<string, unknown>, key?: string): unknown[] => {
  if (key == null) {
    return Object.entries(content)
      .filter(isNotNextPage)
      .map(([, value]: [string, unknown]): unknown => value);
  }

  const nested: unknown = content[key];

  return isContainer(nested) ? Object.values(nested) : [];
};
