import { ratio } from 'fuzzball';

/**
 * Similarité entre deux chaînes, de 0 à 100. Calcul pur, que le domaine peut appeler sans
 * dépendre directement d'une bibliothèque tierce.
 */
export const similarityRatio = (left: string, right: string): number => ratio(left, right);
