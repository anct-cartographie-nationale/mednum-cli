import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { CommuneDuplications, Duplicate, findDuplicates, LieuDuplications } from '../find-duplicates';

export type DuplicationComparison = {
  id1: string;
  id2: string;
  score: number;
  adresseScore: number;
  adresse1: string;
  adresse2: string;
  nomScore: number;
  nom1: string;
  nom2: string;
  distanceScore: number;
  localisation1: string;
  localisation2: string;
  source1: string | undefined;
  source2: string | undefined;
};

type ReadyToProcessDuplicationComparison = {
  lieu1: SchemaLieuMediationNumerique;
  lieu2: SchemaLieuMediationNumerique;
  duplicate: Duplicate;
};

const toDuplicationComparison = ({ lieu1, lieu2, duplicate }: ReadyToProcessDuplicationComparison): DuplicationComparison => ({
  id1: lieu1.id,
  id2: lieu2.id,
  score: Math.trunc((duplicate.voieFuzzyScore + duplicate.nomFuzzyScore + duplicate.distanceScore) / 3),
  adresseScore: duplicate.voieFuzzyScore,
  adresse1: `${lieu1.adresse} ${lieu1.code_postal} ${lieu1.commune}`,
  adresse2: `${lieu2.adresse} ${lieu2.code_postal} ${lieu2.commune}`,
  nomScore: duplicate.nomFuzzyScore,
  nom1: lieu1.nom,
  nom2: lieu2.nom,
  distanceScore: duplicate.distanceScore,
  localisation1: `${lieu1.latitude} : ${lieu1.longitude}`,
  localisation2: `${lieu2.latitude} : ${lieu2.longitude}`,
  source1: lieu1.source,
  source2: lieu2.source
});

const onlyValidScore = (duplication: DuplicationComparison): boolean => !isNaN(duplication.score);

const byScore = ({ score: scoreA }: DuplicationComparison, { score: scoreB }: DuplicationComparison): number => scoreB - scoreA;

const lieuFor =
  (duplicate: { id: string }) =>
  (lieu: SchemaLieuMediationNumerique): boolean =>
    lieu.id === duplicate.id;

const isAlreadyProcessed = (
  lieu1: SchemaLieuMediationNumerique,
  lieu2: SchemaLieuMediationNumerique,
  readyToProcessDuplicationComparison: ReadyToProcessDuplicationComparison[]
): boolean =>
  readyToProcessDuplicationComparison.some(
    ({ lieu1: duplicationForlieu1, lieu2: duplicationForlieu2 }: ReadyToProcessDuplicationComparison): boolean =>
      duplicationForlieu1.id === lieu2.id && duplicationForlieu2.id === lieu1.id
  );

const toDuplicationsForLieu =
  (
    lieux: SchemaLieuMediationNumerique[],
    alreadyRegistredDuplicationComparisons: ReadyToProcessDuplicationComparison[],
    lieuDuplications: LieuDuplications
  ) =>
  (
    readyToProcessDuplicationComparisons: ReadyToProcessDuplicationComparison[],
    duplicate: Duplicate
  ): ReadyToProcessDuplicationComparison[] => {
    const lieu1: SchemaLieuMediationNumerique | undefined = lieux.find(lieuFor(lieuDuplications));
    const lieu2: SchemaLieuMediationNumerique | undefined = lieux.find(lieuFor(duplicate));
    return lieu1 == null || lieu2 == null || isAlreadyProcessed(lieu1, lieu2, alreadyRegistredDuplicationComparisons)
      ? readyToProcessDuplicationComparisons
      : [...readyToProcessDuplicationComparisons, { duplicate, lieu1, lieu2 }];
  };

const getReadyProcessDuplicationComparison = (lieux: SchemaLieuMediationNumerique[]): ReadyToProcessDuplicationComparison[] =>
  findDuplicates(lieux)
    .flatMap((communeDuplications: CommuneDuplications): LieuDuplications[] => communeDuplications.lieux)
    .reduce(
      (
        readyToProcessDuplicationComparisons: ReadyToProcessDuplicationComparison[],
        lieuDuplication: LieuDuplications
      ): ReadyToProcessDuplicationComparison[] => [
        ...readyToProcessDuplicationComparisons,
        ...lieuDuplication.duplicates.reduce(
          toDuplicationsForLieu(lieux, readyToProcessDuplicationComparisons, lieuDuplication),
          []
        )
      ],
      []
    );

export const duplicationComparisons = (lieux: SchemaLieuMediationNumerique[]): DuplicationComparison[] =>
  getReadyProcessDuplicationComparison(lieux).map(toDuplicationComparison).filter(onlyValidScore).sort(byScore);
