/* eslint-disable @typescript-eslint/no-unnecessary-condition*/
import { LabelNational, LabelsNationaux } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Choice, LieuxMediationNumeriqueMatching, DataSource } from '../../input';

const isAllowedTerm = (choice: Choice<LabelNational>, sourceValue: string): boolean =>
  choice.sauf?.every((forbidden: string): boolean => !sourceValue.includes(forbidden)) ?? true;

const isTermFound =
  (sourceValue: string, choice: Choice<LabelNational>) =>
  (found: boolean, term: string): boolean =>
    found || (sourceValue?.includes(term.toLowerCase()) && isAllowedTerm(choice, sourceValue));

const containsOneOfTheTerms = (choice: Choice<LabelNational>, sourceValue: string = ''): boolean =>
  choice.termes == null ? sourceValue !== '' : choice.termes.reduce(isTermFound(sourceValue?.toLowerCase(), choice), false);

const appendLabelNational = (labelsNationaux: LabelNational[], labelNational?: LabelNational): LabelNational[] => [
  ...labelsNationaux,
  ...(labelNational == null ? [] : [labelNational])
];

const isDefault = (choice: Choice<LabelNational>): boolean => choice.colonnes == null;

const findAndAppendLabelsNationaux =
  (choice: Choice<LabelNational>, source: DataSource) =>
  (labelsNationaux: LabelNational[], colonne: string): LabelNational[] =>
    containsOneOfTheTerms(choice, source[colonne]) ? appendLabelNational(labelsNationaux, choice.cible) : labelsNationaux;

const labelsNationauxForTerms =
  (choice: Choice<LabelNational>, source: DataSource) =>
  (labelsNationaux: LabelNational[], colonne: string): LabelNational[] =>
    isDefault(choice)
      ? appendLabelNational(labelsNationaux, choice.cible)
      : findAndAppendLabelsNationaux(choice, source)(labelsNationaux, colonne);

const appendLabelsNationaux =
  (source: DataSource) =>
  (labelsNationaux: LabelNational[], choice: Choice<LabelNational>): LabelNational[] =>
    [...labelsNationaux, ...(choice.colonnes ?? [choice.cible]).reduce(labelsNationauxForTerms(choice, source), [])];

export const processLabelsNationaux = (source: DataSource, matching: LieuxMediationNumeriqueMatching): LabelsNationaux =>
  LabelsNationaux(Array.from(new Set(matching.labels_nationaux?.reduce(appendLabelsNationaux(source), []))));
