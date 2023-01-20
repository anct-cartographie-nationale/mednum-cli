import { Choice, LieuxMediationNumeriqueMatching, DataSource } from '../../input';

const isAllowedTerm = (choice: Choice<string>, sourceValue: string): boolean =>
  choice.sauf?.every((forbidden: string): boolean => !sourceValue.includes(forbidden)) ?? true;

const isTermFound =
  (sourceValue: string, choice: Choice<string>) =>
  (found: boolean, term: string): boolean =>
    found || (sourceValue.includes(term.toLowerCase()) && isAllowedTerm(choice, sourceValue));

const containsOneOfTheTerms = (choice: Choice<string>, sourceValue: string = ''): boolean =>
  choice.termes == null ? sourceValue !== '' : choice.termes.reduce(isTermFound(sourceValue.toLowerCase(), choice), false);

const appendLabelAutre = (labelsAutres: string[], labelAutre?: string): string[] => [
  ...labelsAutres,
  ...(labelAutre == null ? [] : [labelAutre])
];

const isDefault = (choice: Choice<string>): boolean => choice.colonnes == null;

const findAndAppendLabelsAutres =
  (choice: Choice<string>, source: DataSource) =>
  (labelsAutres: string[], colonne: string): string[] =>
    containsOneOfTheTerms(choice, source[colonne]) ? appendLabelAutre(labelsAutres, choice.cible) : labelsAutres;

const labelsAutresForTerms =
  (choice: Choice<string>, source: DataSource) =>
  (labelsAutres: string[], colonne: string): string[] =>
    isDefault(choice)
      ? appendLabelAutre(labelsAutres, choice.cible)
      : findAndAppendLabelsAutres(choice, source)(labelsAutres, colonne);

const appendLabelsAutres =
  (source: DataSource) =>
  (labelsAutres: string[], choice: Choice<string>): string[] =>
    [...labelsAutres, ...(choice.colonnes ?? [choice.cible]).reduce(labelsAutresForTerms(choice, source), [])];

export const processLabelsAutres = (source: DataSource, matching: LieuxMediationNumeriqueMatching): string[] =>
  Array.from(new Set(matching.labels_autres?.reduce(appendLabelsAutres(source), [])));
