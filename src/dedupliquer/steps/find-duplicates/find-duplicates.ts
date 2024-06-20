import { SchemaLieuMediationNumerique, Typologie } from '@gouvfr-anct/lieux-de-mediation-numerique';
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

const sameSource = (lieu: SchemaLieuMediationNumerique, lieuToDeduplicate: SchemaLieuMediationNumerique): boolean =>
  lieu.source === lieuToDeduplicate.source;

const sameId = (lieu: SchemaLieuMediationNumerique, lieuToDeduplicate: SchemaLieuMediationNumerique): boolean =>
  lieu.id === lieuToDeduplicate.id;

const sameCodePostal = (lieu: SchemaLieuMediationNumerique, lieuToDeduplicate: SchemaLieuMediationNumerique): boolean =>
  lieu.code_postal === lieuToDeduplicate.code_postal;

const hasRFSCompatibleTypology = (lieu: SchemaLieuMediationNumerique): boolean =>
  [`${Typologie.RFS}`, `${Typologie.PIMMS}`].includes(lieu.typologie ?? 'NO_TYPOLOGY');

const compatibleTypologies = (lieu: SchemaLieuMediationNumerique, lieuToDeduplicate: SchemaLieuMediationNumerique): boolean =>
  hasRFSCompatibleTypology(lieu) && hasRFSCompatibleTypology(lieuToDeduplicate)
    ? true
    : lieuToDeduplicate.typologie !== Typologie.RFS && lieu.typologie !== Typologie.RFS;

const onlyPotentialDuplicates =
  (lieuToDeduplicate: SchemaLieuMediationNumerique, allowInternalMerge: boolean) =>
  (lieu: SchemaLieuMediationNumerique): boolean =>
    sameCodePostal(lieu, lieuToDeduplicate) &&
    !sameId(lieu, lieuToDeduplicate) &&
    (allowInternalMerge || !sameSource(lieu, lieuToDeduplicate)) &&
    compatibleTypologies(lieu, lieuToDeduplicate);

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

const duplicatesWithScores =
  (lieux: SchemaLieuMediationNumerique[]) =>
  (lieuToDeduplicate: SchemaLieuMediationNumerique, allowInternalMerge: boolean): Duplicate[] =>
    lieux.filter(onlyPotentialDuplicates(lieuToDeduplicate, allowInternalMerge)).map(
      (lieu: SchemaLieuMediationNumerique): Duplicate => ({
        id: lieu.id,
        distanceScore: distanceScore(cartesianDistanceBetween(lieu, lieuToDeduplicate)),
        nomFuzzyScore: ratio(lieu.nom, lieuToDeduplicate.nom),
        voieFuzzyScore: ratio(lieu.adresse, lieuToDeduplicate.adresse)
      })
    );

const appendCommuneDuplications =
  (lieux: SchemaLieuMediationNumerique[]) =>
  (
    lieuToDeduplicate: SchemaLieuMediationNumerique,
    duplications: CommuneDuplications[],
    allowInternalMerge: boolean
  ): CommuneDuplications[] => [
    ...duplications,
    {
      codePostal: lieuToDeduplicate.code_postal,
      lieux: [{ id: lieuToDeduplicate.id, duplicates: duplicatesWithScores(lieux)(lieuToDeduplicate, allowInternalMerge) }]
    }
  ];

const toUpdatedCommuneDuplications =
  (lieux: SchemaLieuMediationNumerique[]) =>
  (lieu: SchemaLieuMediationNumerique, duplicationsWithSameCodePostal: CommuneDuplications, allowInternalMerge: boolean) =>
  (communeDuplications: CommuneDuplications): CommuneDuplications =>
    communeDuplications.codePostal === lieu.code_postal
      ? {
          codePostal: lieu.code_postal,
          lieux: [
            ...duplicationsWithSameCodePostal.lieux,
            { id: lieu.id, duplicates: duplicatesWithScores(lieux)(lieu, allowInternalMerge) }
          ]
        }
      : communeDuplications;

const withSameCodePostal =
  (lieu: SchemaLieuMediationNumerique) =>
  (communeDuplications: CommuneDuplications): boolean =>
    communeDuplications.codePostal === lieu.code_postal;

const toCommunesDuplications =
  (lieux: SchemaLieuMediationNumerique[], allowInternalMerge: boolean) =>
  (duplications: CommuneDuplications[], lieuToDeduplicate: SchemaLieuMediationNumerique): CommuneDuplications[] =>
    ((duplicationsWithSameCodePostal?: CommuneDuplications): CommuneDuplications[] =>
      duplicationsWithSameCodePostal == null
        ? appendCommuneDuplications(lieux)(lieuToDeduplicate, duplications, allowInternalMerge)
        : duplications.map(
            toUpdatedCommuneDuplications(lieux)(lieuToDeduplicate, duplicationsWithSameCodePostal, allowInternalMerge)
          ))(duplications.find(withSameCodePostal(lieuToDeduplicate)));

const onlyWithDuplicates = (lieu: LieuDuplications): boolean => lieu.duplicates.length > 0;

const onlyWithoutDuplicates = (lieu: LieuDuplications): boolean => lieu.duplicates.length === 0;

const toDuplicatesWithout =
  (noDuplicatesIds: string[]) =>
  (lieu: LieuDuplications): LieuDuplications => ({
    id: lieu.id,
    duplicates: lieu.duplicates.filter((duplicate: Duplicate): boolean => !noDuplicatesIds.includes(duplicate.id))
  });

const toId = (lieu: LieuDuplications): string => lieu.id;

const invalidDuplicatesIds = (communeDuplications: CommuneDuplications): string[] =>
  communeDuplications.lieux.filter(onlyWithoutDuplicates).map(toId);

const removeLieuxFrom = (communeDuplications: CommuneDuplications, ids: string[]): CommuneDuplications => ({
  codePostal: communeDuplications.codePostal,
  lieux: communeDuplications.lieux.map(toDuplicatesWithout(ids)).filter(onlyWithDuplicates)
});

const toValidDuplicates = (communeDuplications: CommuneDuplications): CommuneDuplications =>
  removeLieuxFrom(communeDuplications, invalidDuplicatesIds(communeDuplications));

const onlyWithLieux = (communeDuplications: CommuneDuplications): boolean => communeDuplications.lieux.length > 0;

export const findDuplicates = (
  lieux: SchemaLieuMediationNumerique[],
  allowInternalMerge: boolean,
  lieuxToDeduplicate: SchemaLieuMediationNumerique[] = lieux
): CommuneDuplications[] =>
  lieuxToDeduplicate.reduce(toCommunesDuplications(lieux, allowInternalMerge), []).map(toValidDuplicates).filter(onlyWithLieux);
