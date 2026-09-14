import { ANCIENNES_COMMUNES, type NewCommune } from './anciennes-communes.data.js';
import type { Commune } from '../../../../../libraries/collectivites/index.js';

const onlyDefined = <T>(entry: T | undefined): entry is T => entry != null;

const communeMapEntry = (newCommune: NewCommune | undefined, communeName: string): [string, Commune] | undefined => {
  if (newCommune == null) return undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { date, ...commune }: NewCommune = newCommune;
  return [communeName.toLowerCase(), commune];
};

const toAncienneCommuneMapEntry = (ancienneCommuneName: string): [string, Commune] | undefined =>
  communeMapEntry(ANCIENNES_COMMUNES[ancienneCommuneName], ancienneCommuneName);

const ANCIENNES_COMMUNES_MAP: Map<string, Commune> = new Map(
  Object.keys(ANCIENNES_COMMUNES).map(toAncienneCommuneMapEntry).filter(onlyDefined)
);

export const getNewCommune = (ancienneCommune: string): Commune | undefined =>
  ANCIENNES_COMMUNES_MAP.get(ancienneCommune.toLowerCase());
