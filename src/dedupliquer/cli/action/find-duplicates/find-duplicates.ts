import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { ratio } from 'fuzzball';

export type Duplicate = {
  id: string;
  distanceScore: number;
  nomFuzzyScore: number;
  voieFuzzyScore: number;
};

export type LieuDuplications = {
  id: string;
  duplicates: Duplicate[];
};

export type CommuneDuplications = {
  codePostal: string;
  lieux: LieuDuplications[];
};

const onlyPotentialDuplicates =
  (curentLieu: SchemaLieuMediationNumerique) =>
  (lieu: SchemaLieuMediationNumerique): boolean =>
    lieu.code_postal === curentLieu.code_postal && lieu.id !== curentLieu.id && lieu.source !== curentLieu.source;

const MINIMAL_CARTESIAN_DISTANCE: 0.0004 = 0.0004 as const;

/* eslint-disable-next-line no-mixed-operators */
const computeDistanceScore = (cartesianDistance: number): number => 100 / (cartesianDistance * 1000 + 1);

const distanceScore = (cartesianDistance: number): number =>
  Math.trunc(cartesianDistance < MINIMAL_CARTESIAN_DISTANCE ? 100 : computeDistanceScore(cartesianDistance));

const hasDefinedCoordinates = (
  lieu: SchemaLieuMediationNumerique
): lieu is SchemaLieuMediationNumerique & { latitude: number; longitude: number } =>
  lieu.latitude != null && lieu.longitude != null;

/* eslint-disable-next-line no-mixed-operators */
const pythagore = (x1: number, x2: number, y1: number, y2: number): number => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

const cartesianDistanceBetween = (lieu: SchemaLieuMediationNumerique, curentLieu: SchemaLieuMediationNumerique): number =>
  hasDefinedCoordinates(lieu) && hasDefinedCoordinates(curentLieu)
    ? pythagore(lieu.latitude, curentLieu.latitude, lieu.longitude, curentLieu.longitude)
    : NaN;

const duplicatesWithScores = (lieux: SchemaLieuMediationNumerique[], curentLieu: SchemaLieuMediationNumerique): Duplicate[] =>
  lieux.filter(onlyPotentialDuplicates(curentLieu)).map(
    (lieu: SchemaLieuMediationNumerique): Duplicate => ({
      id: lieu.id,
      distanceScore: distanceScore(cartesianDistanceBetween(lieu, curentLieu)),
      nomFuzzyScore: ratio(lieu.nom, curentLieu.nom),
      voieFuzzyScore: ratio(lieu.adresse, curentLieu.adresse)
    })
  );

const appendCommuneDuplications = (
  lieu: SchemaLieuMediationNumerique,
  lieux: SchemaLieuMediationNumerique[],
  duplications: CommuneDuplications[]
): CommuneDuplications[] => [
  ...duplications,
  {
    codePostal: lieu.code_postal,
    lieux: [{ id: lieu.id, duplicates: duplicatesWithScores(lieux, lieu) }]
  }
];

const toUpdatedCommuneDuplications =
  (
    lieu: SchemaLieuMediationNumerique,
    lieux: SchemaLieuMediationNumerique[],
    duplicationsWithSameCodePostal: CommuneDuplications
  ) =>
  (communeDuplications: CommuneDuplications): CommuneDuplications =>
    communeDuplications.codePostal === lieu.code_postal
      ? {
          codePostal: lieu.code_postal,
          lieux: [...duplicationsWithSameCodePostal.lieux, { id: lieu.id, duplicates: duplicatesWithScores(lieux, lieu) }]
        }
      : communeDuplications;

const withSameCodePostal =
  (lieu: SchemaLieuMediationNumerique) =>
  (communeDuplications: CommuneDuplications): boolean =>
    communeDuplications.codePostal === lieu.code_postal;

const toCommunesDuplications = (
  duplications: CommuneDuplications[],
  lieu: SchemaLieuMediationNumerique,
  _: number,
  lieux: SchemaLieuMediationNumerique[]
): CommuneDuplications[] =>
  ((duplicationsWithSameCodePostal?: CommuneDuplications): CommuneDuplications[] =>
    duplicationsWithSameCodePostal == null
      ? appendCommuneDuplications(lieu, lieux, duplications)
      : duplications.map(toUpdatedCommuneDuplications(lieu, lieux, duplicationsWithSameCodePostal)))(
    duplications.find(withSameCodePostal(lieu))
  );

const onlyWithDuplicates = (communeDuplications: CommuneDuplications): boolean =>
  communeDuplications.lieux.every((lieuDuplications: LieuDuplications): boolean => lieuDuplications.duplicates.length > 0);

export const findDuplicates = (lieux: SchemaLieuMediationNumerique[]): CommuneDuplications[] =>
  lieux.reduce(toCommunesDuplications, []).filter(onlyWithDuplicates);
