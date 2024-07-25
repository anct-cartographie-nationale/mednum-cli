import { FormationLabel, FormationsLabels } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Choice, LieuxMediationNumeriqueMatching, DataSource, cibleAsDefault } from '../../input';

const isAllowedTerm = (choice: Choice<FormationLabel>, sourceValue: string): boolean =>
  choice.sauf?.every((forbidden: string): boolean => !sourceValue.includes(forbidden)) ?? true;

const isTermFound =
  (sourceValue: string, choice: Choice<FormationLabel>) =>
  (found: boolean, term: string): boolean =>
    found || (sourceValue.includes(term.toLowerCase()) && isAllowedTerm(choice, sourceValue));

const containsOneOfTheTerms = (choice: Choice<FormationLabel>, sourceValue: string = ''): boolean =>
  choice.termes == null ? sourceValue !== '' : choice.termes.reduce(isTermFound(sourceValue.toLowerCase(), choice), false);

const appendFormationLabel = (formationsLabels: FormationLabel[], formationLabel?: FormationLabel): FormationLabel[] => [
  ...formationsLabels,
  ...(formationLabel == null ? [] : [formationLabel])
];

const isDefault = (choice: Choice<FormationLabel>): boolean => choice.colonnes == null;

const findAndAppendFormationsLabels =
  (choice: Choice<FormationLabel>, source: DataSource) =>
  (formationsLabels: FormationLabel[], colonne: string): FormationLabel[] =>
    containsOneOfTheTerms(choice, source[colonne]?.toString())
      ? appendFormationLabel(formationsLabels, choice.cible)
      : formationsLabels;

const formationsLabelsForTerms =
  (choice: Choice<FormationLabel>, source: DataSource) =>
  (formationsLabels: FormationLabel[], colonne: string): FormationLabel[] =>
    isDefault(choice)
      ? appendFormationLabel(formationsLabels, choice.cible)
      : findAndAppendFormationsLabels(choice, source)(formationsLabels, colonne);

const appendFormationsLabels =
  (source: DataSource) =>
  (formationsLabels: FormationLabel[], choice: Choice<FormationLabel>): FormationLabel[] => [
    ...formationsLabels,
    ...(choice.colonnes ?? cibleAsDefault(choice)).reduce(formationsLabelsForTerms(choice, source), [])
  ];

export const processFormationsLabels = (source: DataSource, matching: LieuxMediationNumeriqueMatching): FormationsLabels =>
  FormationsLabels(Array.from(new Set(matching.formations_labels?.reduce(appendFormationsLabels(source), []))));
