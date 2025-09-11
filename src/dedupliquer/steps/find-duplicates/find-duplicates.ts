import { SchemaLieuMediationNumerique, Typologie, Typologies } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { ratio } from 'fuzzball';

export type Duplicate = { id: string; distanceScore: number; nomFuzzyScore: number; voieFuzzyScore: number };

export type LieuDuplications = { id: string; duplicates: Duplicate[] };

export type CommuneDuplications = { code_insee: string; lieux: LieuDuplications[] };

const sameSource = (lieu: SchemaLieuMediationNumerique, lieuToDeduplicate: SchemaLieuMediationNumerique): boolean =>
  lieu.source === lieuToDeduplicate.source;

const sameId = (lieu: SchemaLieuMediationNumerique, lieuToDeduplicate: SchemaLieuMediationNumerique): boolean =>
  lieu.id === lieuToDeduplicate.id;

const sameCodeInsee = (lieu: SchemaLieuMediationNumerique, lieuToDeduplicate: SchemaLieuMediationNumerique): boolean =>
  lieu.code_insee === lieuToDeduplicate.code_insee;

const compatibleTypologies: [Typologie, Typologie][] = [[Typologie.RFS, Typologie.PIMMS]];

const toTypologies = ({ typologie }: { typologie?: string }): Typologies =>
  Typologies((typologie?.split('|') as Typologies) ?? []);

const anyEmpty = (lieuTypologies: Typologies, lieuToDeduplicateTypologies: Typologies) =>
  lieuTypologies.length === 0 || lieuToDeduplicateTypologies.length === 0;

const hasSameTypologieIn = (lieuToDeduplicateTypologies: Typologies) => (typologie: Typologie) =>
  lieuToDeduplicateTypologies.includes(typologie);

const hasCompatibleTypologiesFor =
  (lieuTypologies: Typologies, lieuToDeduplicateTypologies: Typologies) =>
  ([typologyA, typologyB]: [Typologie, Typologie]) =>
    (lieuTypologies.includes(typologyA) && lieuToDeduplicateTypologies.includes(typologyB)) ||
    (lieuTypologies.includes(typologyB) && lieuToDeduplicateTypologies.includes(typologyA));

const sameTypologie = (lieuTypologies: Typologies, lieuToDeduplicateTypologies: Typologies): boolean =>
  anyEmpty(lieuTypologies, lieuToDeduplicateTypologies) ||
  lieuTypologies.some(hasSameTypologieIn(lieuToDeduplicateTypologies)) ||
  compatibleTypologies.some(hasCompatibleTypologiesFor(lieuTypologies, lieuToDeduplicateTypologies));

const onlyPotentialDuplicates =
  (lieuToDeduplicate: SchemaLieuMediationNumerique, allowInternalMerge: boolean) =>
  (lieu: SchemaLieuMediationNumerique): boolean =>
    sameCodeInsee(lieu, lieuToDeduplicate) &&
    !sameId(lieu, lieuToDeduplicate) &&
    (allowInternalMerge || !sameSource(lieu, lieuToDeduplicate)) &&
    sameTypologie(toTypologies(lieu), toTypologies(lieuToDeduplicate));

const MINIMAL_CARTESIAN_DISTANCE: 0.0004 = 0.0004 as const;

const computeDistanceScore = (cartesianDistance: number): number => 100 / (cartesianDistance * 1000 + 1);

const distanceScore = (cartesianDistance: number): number =>
  Math.trunc(cartesianDistance < MINIMAL_CARTESIAN_DISTANCE ? 100 : computeDistanceScore(cartesianDistance));

const hasDefinedCoordinates = (
  lieu: SchemaLieuMediationNumerique
): lieu is SchemaLieuMediationNumerique & { latitude: number; longitude: number } =>
  lieu.latitude != null && lieu.longitude != null;

const pythagore = (x1: number, x2: number, y1: number, y2: number): number => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

const cartesianDistanceBetween = (lieu: SchemaLieuMediationNumerique, cible: SchemaLieuMediationNumerique): number =>
  hasDefinedCoordinates(lieu) && hasDefinedCoordinates(cible)
    ? pythagore(lieu.latitude, cible.latitude, lieu.longitude, cible.longitude)
    : 0;

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

const toLieuDuplications = (
  lieu: SchemaLieuMediationNumerique,
  lieux: SchemaLieuMediationNumerique[],
  allowInternalMerge: boolean
): LieuDuplications => ({ id: lieu.id, duplicates: duplicatesWithScores(lieux)(lieu, allowInternalMerge) });

const appendCommuneDuplications =
  (lieux: SchemaLieuMediationNumerique[]) =>
  (
    lieuToDeduplicate: SchemaLieuMediationNumerique,
    duplications: CommuneDuplications[],
    allowInternalMerge: boolean
  ): CommuneDuplications[] =>
    lieuToDeduplicate.code_insee != null
      ? [
          ...duplications,
          {
            code_insee: lieuToDeduplicate.code_insee,
            lieux: [toLieuDuplications(lieuToDeduplicate, lieux, allowInternalMerge)]
          }
        ]
      : duplications;

const toUpdatedCommuneDuplications =
  (lieux: SchemaLieuMediationNumerique[]) =>
  (lieu: SchemaLieuMediationNumerique, duplicationsWithSameCodeInsee: CommuneDuplications, allowInternalMerge: boolean) =>
  (communeDuplications: CommuneDuplications): CommuneDuplications =>
    communeDuplications.code_insee === lieu.code_insee
      ? {
          code_insee: lieu.code_insee,
          lieux: [...duplicationsWithSameCodeInsee.lieux, toLieuDuplications(lieu, lieux, allowInternalMerge)]
        }
      : communeDuplications;

const withSameCodeInsee =
  (lieu: SchemaLieuMediationNumerique) =>
  ({ code_insee }: CommuneDuplications): boolean =>
    code_insee === lieu.code_insee;

const toCommunesDuplications =
  (lieux: SchemaLieuMediationNumerique[], allowInternalMerge: boolean) =>
  (duplications: CommuneDuplications[], lieuToDeduplicate: SchemaLieuMediationNumerique): CommuneDuplications[] =>
    ((duplicationsWithSameCodeInsee?: CommuneDuplications): CommuneDuplications[] =>
      duplicationsWithSameCodeInsee == null
        ? appendCommuneDuplications(lieux)(lieuToDeduplicate, duplications, allowInternalMerge)
        : duplications.map(
            toUpdatedCommuneDuplications(lieux)(lieuToDeduplicate, duplicationsWithSameCodeInsee, allowInternalMerge)
          ))(duplications.find(withSameCodeInsee(lieuToDeduplicate)));

const onlyWithDuplicates = ({ duplicates }: LieuDuplications): boolean => duplicates.length > 0;

const onlyWithoutDuplicates = ({ duplicates }: LieuDuplications): boolean => duplicates.length === 0;

const toDuplicatesWithout =
  (noDuplicatesIds: string[]) =>
  ({ id, duplicates }: LieuDuplications): LieuDuplications => ({
    id,
    duplicates: duplicates.filter((duplicate: Duplicate): boolean => !noDuplicatesIds.includes(duplicate.id))
  });

const invalidDuplicatesIds = ({ lieux }: CommuneDuplications): string[] =>
  lieux.filter(onlyWithoutDuplicates).map((lieu: LieuDuplications): string => lieu.id);

const removeLieuxFrom = ({ code_insee, lieux }: CommuneDuplications, ids: string[]): CommuneDuplications => ({
  code_insee,
  lieux: lieux.map(toDuplicatesWithout(ids)).filter(onlyWithDuplicates)
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
