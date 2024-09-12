import { Frais, FraisACharge } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Choice, LieuxMediationNumeriqueMatching, DataSource, cibleAsDefault } from '../../input';

const isAllowedTerm = (choice: Choice<Frais>, sourceValue: string): boolean =>
  choice.sauf?.every((forbidden: string): boolean => !sourceValue.includes(forbidden)) ?? true;

const isTermFound =
  (sourceValue: string, choice: Choice<Frais>) =>
  (found: boolean, term: string): boolean =>
    found || (sourceValue.includes(term.toLowerCase()) && isAllowedTerm(choice, sourceValue));

const containsOneOfTheTerms = (choice: Choice<Frais>, sourceValue: string = ''): boolean =>
  choice.termes == null ? sourceValue !== '' : choice.termes.reduce(isTermFound(sourceValue.toLowerCase(), choice), false);

const appendFrais = (fraisACharge: Frais[], frais?: Frais): Frais[] => [...fraisACharge, ...(frais == null ? [] : [frais])];

const isDefault = (choice: Choice<Frais>): boolean => choice.colonnes == null;

const findAndAppendFraisACharge =
  (choice: Choice<Frais>, source: DataSource) =>
  (fraisACharge: Frais[], colonne: string): Frais[] =>
    containsOneOfTheTerms(choice, source[colonne]?.toString()) ? appendFrais(fraisACharge, choice.cible) : fraisACharge;

const fraisAChargeForTerms =
  (choice: Choice<Frais>, source: DataSource) =>
  (fraisACharge: Frais[], colonne: string): Frais[] =>
    isDefault(choice)
      ? appendFrais(fraisACharge, choice.cible)
      : findAndAppendFraisACharge(choice, source)(fraisACharge, colonne);

const appendFraisACharge =
  (source: DataSource) =>
  (fraisACharge: Frais[], choice: Choice<Frais>): Frais[] => [
    ...fraisACharge,
    ...(choice.colonnes ?? cibleAsDefault(choice)).reduce(fraisAChargeForTerms(choice, source), [])
  ];

export const processFraisACharge = (source: DataSource, matching: LieuxMediationNumeriqueMatching): FraisACharge =>
  FraisACharge(Array.from(new Set(matching.frais_a_charge?.reduce(appendFraisACharge(source), []))));
