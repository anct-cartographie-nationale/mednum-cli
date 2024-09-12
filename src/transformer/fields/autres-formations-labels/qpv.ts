import { Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';

export type QpvShapesMap = Map<
  string,
  {
    type: 'Polygon';
    coordinates: number[][][];
  }[]
>;

export type IsInQpv = (codeInsee: string, localisation: Localisation) => boolean;
