import { PublicSpecifiquementAdresse, PublicsSpecifiquementAdresses } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Choice, LieuxMediationNumeriqueMatching, DataSource, cibleAsDefault } from '../../input';

const isAllowedTerm = (choice: Choice<PublicSpecifiquementAdresse>, sourceValue: string): boolean =>
  choice.sauf?.every((forbidden: string): boolean => !sourceValue.includes(forbidden)) ?? true;

const isTermFound =
  (sourceValue: string, choice: Choice<PublicSpecifiquementAdresse>) =>
  (found: boolean, term: string): boolean =>
    found || (sourceValue.includes(term.toLowerCase()) && isAllowedTerm(choice, sourceValue));

const containsOneOfTheTerms = (choice: Choice<PublicSpecifiquementAdresse>, sourceValue: string = ''): boolean =>
  choice.termes == null
    ? sourceValue !== ''
    : choice.termes.reduce(isTermFound(sourceValue.toString().toLowerCase(), choice), false);

const appendPublicSpecifiquementAdresse = (
  publicsSpecifiquementAdresses: PublicSpecifiquementAdresse[],
  publicSpecifiquementAdresse?: PublicSpecifiquementAdresse
): PublicSpecifiquementAdresse[] => [
  ...publicsSpecifiquementAdresses,
  ...(publicSpecifiquementAdresse == null ? [] : [publicSpecifiquementAdresse])
];

const isDefault = (choice: Choice<PublicSpecifiquementAdresse>): boolean => choice.colonnes == null;

const findAndAppendPublicSpecifiquementAdresse =
  (choice: Choice<PublicSpecifiquementAdresse>, source: DataSource) =>
  (publicsSpecifiquementAdresses: PublicSpecifiquementAdresse[], colonne: string): PublicSpecifiquementAdresse[] =>
    containsOneOfTheTerms(choice, source[colonne]?.toString())
      ? appendPublicSpecifiquementAdresse(publicsSpecifiquementAdresses, choice.cible)
      : publicsSpecifiquementAdresses;

const publicsSpecifiquementAdressesForTerms =
  (choice: Choice<PublicSpecifiquementAdresse>, source: DataSource) =>
  (publicsSpecifiquementAdresses: PublicSpecifiquementAdresse[], colonne: string): PublicSpecifiquementAdresse[] =>
    isDefault(choice)
      ? appendPublicSpecifiquementAdresse(publicsSpecifiquementAdresses, choice.cible)
      : findAndAppendPublicSpecifiquementAdresse(choice, source)(publicsSpecifiquementAdresses, colonne);

const appendPublicsSpecifiquementAdresses =
  (source: DataSource) =>
  (
    publicsSpecifiquementAdresses: PublicSpecifiquementAdresse[],
    choice: Choice<PublicSpecifiquementAdresse>
  ): PublicSpecifiquementAdresse[] => [
    ...publicsSpecifiquementAdresses,
    ...(choice.colonnes ?? cibleAsDefault(choice)).reduce(publicsSpecifiquementAdressesForTerms(choice, source), [])
  ];

export const processPublicsSpecifiquementAdresses = (
  source: DataSource,
  matching: LieuxMediationNumeriqueMatching
): PublicsSpecifiquementAdresses =>
  PublicsSpecifiquementAdresses(
    Array.from(new Set(matching.publics_specifiquement_adresses?.reduce(appendPublicsSpecifiquementAdresses(source), []) ?? []))
  );
