import { DuplicationComparison } from '../duplication-comparisons';

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
