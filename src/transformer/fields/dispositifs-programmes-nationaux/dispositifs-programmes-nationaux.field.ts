import { DispositifProgrammeNational, DispositifProgrammesNationaux } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Choice, LieuxMediationNumeriqueMatching, DataSource, cibleAsDefault } from '../../input';

const isAllowedTerm = (choice: Choice<DispositifProgrammeNational>, sourceValue: string): boolean =>
  choice.sauf?.every((forbidden: string): boolean => !sourceValue.includes(forbidden)) ?? true;

const isTermFound =
  (sourceValue: string, choice: Choice<DispositifProgrammeNational>) =>
  (found: boolean, term: string): boolean =>
    found || (sourceValue.includes(term.toLowerCase()) && isAllowedTerm(choice, sourceValue));

const containsOneOfTheTerms = (choice: Choice<DispositifProgrammeNational>, sourceValue: string = ''): boolean =>
  choice.termes == null ? sourceValue !== '' : choice.termes.reduce(isTermFound(sourceValue.toLowerCase(), choice), false);

const appendDispositifProgrammeNational = (
  dispositifsProgrammesNationaux: DispositifProgrammeNational[],
  dispositifProgrammeNational?: DispositifProgrammeNational
): DispositifProgrammeNational[] => [
  ...dispositifsProgrammesNationaux,
  ...(dispositifProgrammeNational == null ? [] : [dispositifProgrammeNational])
];

const isDefault = (choice: Choice<DispositifProgrammeNational>): boolean => choice.colonnes == null;

const findAndAppendDispositifsProgrammesNationaux =
  (choice: Choice<DispositifProgrammeNational>, source: DataSource) =>
  (dispositifsProgrammesNationaux: DispositifProgrammeNational[], colonne: string): DispositifProgrammeNational[] =>
    containsOneOfTheTerms(choice, source[colonne]?.toString())
      ? appendDispositifProgrammeNational(dispositifsProgrammesNationaux, choice.cible)
      : dispositifsProgrammesNationaux;

const dispositifsProgrammesNationauxForTerms =
  (choice: Choice<DispositifProgrammeNational>, source: DataSource) =>
  (dispositifsProgrammesNationaux: DispositifProgrammeNational[], colonne: string): DispositifProgrammeNational[] =>
    isDefault(choice)
      ? appendDispositifProgrammeNational(dispositifsProgrammesNationaux, choice.cible)
      : findAndAppendDispositifsProgrammesNationaux(choice, source)(dispositifsProgrammesNationaux, colonne);

const appendDispositifsProgrammesNationaux =
  (source: DataSource) =>
  (
    dispositifsProgrammesNationaux: DispositifProgrammeNational[],
    choice: Choice<DispositifProgrammeNational>
  ): DispositifProgrammeNational[] => [
    ...dispositifsProgrammesNationaux,
    ...(choice.colonnes ?? cibleAsDefault(choice)).reduce(dispositifsProgrammesNationauxForTerms(choice, source), [])
  ];

export const processDispositifProgrammeNationaux = (
  source: DataSource,
  matching: LieuxMediationNumeriqueMatching
): DispositifProgrammesNationaux =>
  DispositifProgrammesNationaux(
    Array.from(new Set(matching.dispositif_programmes_nationaux?.reduce(appendDispositifsProgrammesNationaux(source), [])))
  );
