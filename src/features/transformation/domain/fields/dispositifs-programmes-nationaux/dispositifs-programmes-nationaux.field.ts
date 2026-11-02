import { DispositifProgrammeNational, DispositifProgrammesNationaux } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { type Choice, type LieuxMediationNumeriqueMatching, type DataSource, cibleAsDefault } from '../../matching';
import type { Recorder } from '../../report';

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

export const SOURCE_COOP_NUMERIQUE = 'Coop numérique';

export const DISPOSITIF_PROGRAMMES_NATIONAUX_FIELD = 'dispositif_programmes_nationaux';

const CONSEILLERS_NUMERIQUES_RESERVE_A_LA_COOP =
  'Seule la Coop de la médiation numérique atteste le label « Conseillers numériques » : le label déclaré par la source est retiré';

const declareConseillersNumeriques = (dispositifs: DispositifProgrammesNationaux): boolean =>
  dispositifs.includes(DispositifProgrammeNational.ConseillersNumeriques);

const sansConseillersNumeriques = (dispositifs: DispositifProgrammesNationaux): DispositifProgrammesNationaux =>
  DispositifProgrammesNationaux(
    dispositifs.filter(
      (dispositif: DispositifProgrammeNational): boolean => dispositif !== DispositifProgrammeNational.ConseillersNumeriques
    )
  );

export const reserveALaCoop = (
  dispositifs: DispositifProgrammesNationaux,
  sourceName: string,
  recorder: Recorder,
  entryName: string
): DispositifProgrammesNationaux => {
  if (sourceName === SOURCE_COOP_NUMERIQUE || !declareConseillersNumeriques(dispositifs)) return dispositifs;

  recorder.record(DISPOSITIF_PROGRAMMES_NATIONAUX_FIELD, CONSEILLERS_NUMERIQUES_RESERVE_A_LA_COOP, entryName);

  return sansConseillersNumeriques(dispositifs);
};
