import { ANCIENNES_COMMUNES, NewCommune } from '../../../data/anciennes-communes';
import { Commune } from './find-commune';

const onlyDefined = <T>(entry: T | undefined): entry is T => entry != null;

const communeMapEntry = (newCommune: NewCommune | undefined, communeName: string): [string, Commune] | undefined => {
  if (newCommune == null) return undefined;
  const { date, ...commune }: NewCommune = newCommune;
  return [communeName, commune];
};

const toAncienneCommuneMapEntry = (ancienneCommuneName: string): [string, Commune] | undefined =>
  communeMapEntry(ANCIENNES_COMMUNES[ancienneCommuneName], ancienneCommuneName);

export const ANCIENNES_COMMUNES_MAP: Map<string, Commune> = new Map(
  Object.keys(ANCIENNES_COMMUNES).map(toAncienneCommuneMapEntry).filter(onlyDefined)
);
