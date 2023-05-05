import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { CommuneDuplications, Duplicate, DuplicationComparison, findDuplicates, LieuDuplications } from './dedupliquer.action';

type ReadyToProcessDuplicationComparison = {
  lieu1: SchemaLieuMediationNumerique;
  lieu2: SchemaLieuMediationNumerique;
  duplicate: Duplicate;
};

const toDuplicationComparison = ({ lieu1, lieu2, duplicate }: ReadyToProcessDuplicationComparison): DuplicationComparison => ({
  score: Math.trunc((duplicate.voieFuzzyScore + duplicate.nomFuzzyScore + duplicate.distanceScore) / 3),
  adresseScore: duplicate.voieFuzzyScore,
  adresse1: `${lieu1.adresse} ${lieu1.code_postal} ${lieu1.commune}`,
  adresse2: `${lieu2.adresse} ${lieu2.code_postal} ${lieu2.commune}`,
  nomScore: duplicate.nomFuzzyScore,
  nom1: lieu1.nom,
  nom2: lieu2.nom,
  distanceScore: duplicate.distanceScore,
  localisation1: `${lieu1.latitude} : ${lieu1.longitude}`,
  localisation2: `${lieu2.latitude} : ${lieu2.longitude}`
});

const lieuFor =
  (duplicate: { id: string }) =>
  (lieu: SchemaLieuMediationNumerique): boolean =>
    lieu.id === duplicate.id;

const isAlreadyProcessed = (
  lieu1: SchemaLieuMediationNumerique,
  lieu2: SchemaLieuMediationNumerique,
  duplicationComparisons: ReadyToProcessDuplicationComparison[]
): boolean =>
  duplicationComparisons.some(
    (value: ReadyToProcessDuplicationComparison) => value.lieu1.id === lieu2.id && value.lieu2.id === lieu1.id
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
    .flatMap((communeDuplications: CommuneDuplications) => communeDuplications.lieux)
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
  getReadyProcessDuplicationComparison(lieux).map(toDuplicationComparison);

const DUPLICATION_COMPARISON_HEADINGS: string = [
  'Score',
  'Score Nom',
  'Nom 1',
  'Nom 2',
  'Score Adresse',
  'Adresse 1',
  'Adresse 2',
  'Score Distance',
  'Localisation 1',
  'Localisation 2'
].join(';');

const duplicationComparisonLineFor = (duplicationComparison: DuplicationComparison): string =>
  [
    duplicationComparison.score,
    duplicationComparison.nomScore,
    duplicationComparison.nom1.replace(';', ''),
    duplicationComparison.nom2.replace(';', ''),
    duplicationComparison.adresseScore,
    duplicationComparison.adresse1.replace(';', ''),
    duplicationComparison.adresse2.replace(';', ''),
    duplicationComparison.distanceScore,
    duplicationComparison.localisation1,
    duplicationComparison.localisation2
  ].join(';');

export const formatToCSV = (duplicationComparisons: DuplicationComparison[]): string =>
  [
    DUPLICATION_COMPARISON_HEADINGS,
    ...duplicationComparisons.map((duplicationComparison: DuplicationComparison): string =>
      duplicationComparisonLineFor(duplicationComparison)
    )
  ].join('\n');
