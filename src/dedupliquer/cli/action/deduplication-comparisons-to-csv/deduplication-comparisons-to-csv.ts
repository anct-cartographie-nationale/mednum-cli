import { DuplicationComparison } from '../../../steps';

const DUPLICATION_COMPARISON_HEADINGS: string = [
  'Score',
  'Typologie 1',
  'Typologie 2',
  'Score Nom',
  'Nom 1',
  'Nom 2',
  'Score Adresse',
  'Adresse 1',
  'Adresse 2',
  'Score Distance',
  'Localisation 1',
  'Localisation 2',
  'Source 1',
  'Source 2'
].join(';');

const duplicationComparisonLineFor = (duplicationComparison: DuplicationComparison): string =>
  [
    duplicationComparison.score,
    duplicationComparison.typologie1?.replace(';', ','),
    duplicationComparison.typologie2?.replace(';', ','),
    duplicationComparison.nomScore,
    duplicationComparison.nom1.replace(';', ''),
    duplicationComparison.nom2.replace(';', ''),
    duplicationComparison.adresseScore,
    duplicationComparison.adresse1.replace(';', ''),
    duplicationComparison.adresse2.replace(';', ''),
    duplicationComparison.distanceScore,
    duplicationComparison.localisation1,
    duplicationComparison.localisation2,
    duplicationComparison.source1,
    duplicationComparison.source2
  ].join(';');

export const formatToCSV = (duplicationComparisons: DuplicationComparison[]): string =>
  [DUPLICATION_COMPARISON_HEADINGS, ...duplicationComparisons.map(duplicationComparisonLineFor)].join('\n');
