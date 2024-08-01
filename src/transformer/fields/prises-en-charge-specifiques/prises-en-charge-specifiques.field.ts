import { PriseEnChargeSpecifique, PrisesEnChargeSpecifiques } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Choice, LieuxMediationNumeriqueMatching, DataSource, cibleAsDefault } from '../../input';

const isAllowedTerm = (choice: Choice<PriseEnChargeSpecifique>, sourceValue: string): boolean =>
  choice.sauf?.every((forbidden: string): boolean => !sourceValue.includes(forbidden)) ?? true;

const isTermFound =
  (sourceValue: string, choice: Choice<PriseEnChargeSpecifique>) =>
  (found: boolean, term: string): boolean =>
    found || (sourceValue.includes(term.toLowerCase()) && isAllowedTerm(choice, sourceValue));

const containsOneOfTheTerms = (choice: Choice<PriseEnChargeSpecifique>, sourceValue: string = ''): boolean =>
  choice.termes == null
    ? sourceValue !== ''
    : choice.termes.reduce(isTermFound(sourceValue.toString().toLowerCase(), choice), false);

const appendPriseEnChargeSpecifique = (
  priseEnChargeSpecifique: PriseEnChargeSpecifique[],
  prisesEnChargeSpecifiques?: PriseEnChargeSpecifique
): PriseEnChargeSpecifique[] => [
  ...priseEnChargeSpecifique,
  ...(prisesEnChargeSpecifiques == null ? [] : [prisesEnChargeSpecifiques])
];

const isDefault = (choice: Choice<PriseEnChargeSpecifique>): boolean => choice.colonnes == null;

const findAndAppendPriseEnChargeSpecifique =
  (choice: Choice<PriseEnChargeSpecifique>, source: DataSource) =>
  (prisesEnChargeSpecifiques: PriseEnChargeSpecifique[], colonne: string): PriseEnChargeSpecifique[] =>
    containsOneOfTheTerms(choice, source[colonne]?.toString())
      ? appendPriseEnChargeSpecifique(prisesEnChargeSpecifiques, choice.cible)
      : prisesEnChargeSpecifiques;

const prisesEnChargeSpecifiquesForTerms =
  (choice: Choice<PriseEnChargeSpecifique>, source: DataSource) =>
  (prisesEnChargeSpecifiques: PriseEnChargeSpecifique[], colonne: string): PriseEnChargeSpecifique[] =>
    isDefault(choice)
      ? appendPriseEnChargeSpecifique(prisesEnChargeSpecifiques, choice.cible)
      : findAndAppendPriseEnChargeSpecifique(choice, source)(prisesEnChargeSpecifiques, colonne);

const appendPrisesEnChargeSpecifiques =
  (source: DataSource) =>
  (
    prisesEnChargeSpecifiques: PriseEnChargeSpecifique[],
    choice: Choice<PriseEnChargeSpecifique>
  ): PriseEnChargeSpecifique[] => [
    ...prisesEnChargeSpecifiques,
    ...(choice.colonnes ?? cibleAsDefault(choice)).reduce(prisesEnChargeSpecifiquesForTerms(choice, source), [])
  ];

export const processPrisesEnChargeSpecifiques = (
  source: DataSource,
  matching: LieuxMediationNumeriqueMatching
): PrisesEnChargeSpecifiques =>
  PrisesEnChargeSpecifiques(
    Array.from(new Set(matching.prise_en_charge_specifique?.reduce(appendPrisesEnChargeSpecifiques(source), []) ?? []))
  );
