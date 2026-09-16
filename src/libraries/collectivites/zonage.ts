import type { Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';

/**
 * Quartiers prioritaires de la politique de la ville, indexés par code INSEE de commune.
 */
export type QpvShapesMap = Map<
  string,
  {
    type: 'Polygon';
    coordinates: number[][][];
  }[]
>;

export type IsInQpv = (codeInsee: string, localisation: Localisation) => boolean;

/**
 * Communes classées France Ruralités Revitalisation, indexées par code INSEE.
 */
export type FrrMap = Map<string, boolean>;

export type IsInFrr = (codeInsee: string) => boolean;
