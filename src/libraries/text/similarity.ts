import { ratio, token_set_ratio } from 'fuzzball';

const LIGATURES: Record<string, string> = { œ: 'oe', Œ: 'OE', æ: 'ae', Æ: 'AE' };

const DIACRITIQUES = /[̀-ͯ]/gu;

const plier = (valeur: string): string =>
  (valeur ?? '')
    .replace(/[œŒæÆ]/gu, (ligature: string): string => LIGATURES[ligature] ?? ligature)
    .normalize('NFD')
    .replace(DIACRITIQUES, '');

/**
 * Similarité entre deux chaînes, de 0 à 100. Calcul pur, que le domaine peut appeler sans
 * dépendre directement d'une bibliothèque tierce.
 */
export const similarityRatio = (left: string, right: string): number => ratio(plier(left), plier(right));

export const tokenSetSimilarityRatio = (left: string, right: string): number => token_set_ratio(plier(left), plier(right));
