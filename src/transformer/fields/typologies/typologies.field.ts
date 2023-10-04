import { LabelNational, Typologie, Typologies } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Choice, cibleAsDefault, DataSource, LieuxMediationNumeriqueMatching } from '../../input';
import { TYPOLOGIE_MATCHERS } from './name-to-typologie';
import { processLabelsNationaux } from '../labels-nationaux/labels-nationaux.field';

export type TypologieMatcher = {
  typologie: Typologie;
  matchers: RegExp[];
};

const isAllowedTerm = (choice: Choice<Typologie>, sourceValue: string): boolean =>
  choice.sauf?.every((forbidden: string): boolean => !sourceValue.includes(forbidden)) ?? true;

const isTermFound =
  (sourceValue: string, choice: Choice<Typologie>) =>
  (found: boolean, term: string): boolean =>
    found || (sourceValue.includes(term.toLowerCase()) && isAllowedTerm(choice, sourceValue));

const containsOneOfTheTerms = (choice: Choice<Typologie>, sourceValue: string = ''): boolean =>
  choice.termes == null ? sourceValue !== '' : choice.termes.reduce(isTermFound(sourceValue.toLowerCase(), choice), false);

const appendTypologie = (typologies: Typologie[], typologie?: Typologie): Typologie[] => [
  ...typologies,
  ...(typologie == null ? [] : [typologie])
];

const isDefault = (choice: Choice<Typologie>): boolean => choice.colonnes == null;

const findAndAppendTypologies =
  (choice: Choice<Typologie>, source: DataSource) =>
  (typologies: Typologie[], colonne: string): Typologie[] =>
    containsOneOfTheTerms(choice, source[colonne]?.toString()) ? appendTypologie(typologies, choice.cible) : typologies;

const typologiesForTerms =
  (choice: Choice<Typologie>, source: DataSource) =>
  (typologies: Typologie[], colonne: string): Typologie[] =>
    isDefault(choice)
      ? appendTypologie(typologies, choice.cible)
      : findAndAppendTypologies(choice, source)(typologies, colonne);

const appendTypologies =
  (source: DataSource) =>
  (typologies: Typologie[], choice: Choice<Typologie>): Typologie[] =>
    [...typologies, ...(choice.colonnes ?? cibleAsDefault(choice)).reduce(typologiesForTerms(choice, source), [])];

const matchWithName =
  (source: DataSource, matching: LieuxMediationNumeriqueMatching) =>
  (hasMatch: boolean, regExp: RegExp): boolean =>
    hasMatch || regExp.test(source[matching.nom.colonne]?.toString() ?? '');

const toTypologieMatchingName =
  (source: DataSource, matching: LieuxMediationNumeriqueMatching) =>
  (typologies: Typologies, typologieMatcher: TypologieMatcher): Typologies =>
    typologieMatcher.matchers.reduce(matchWithName(source, matching), false)
      ? Typologies([typologieMatcher.typologie])
      : typologies;

const inferTypologies = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Typologies =>
  processLabelsNationaux(source, matching).includes(LabelNational.FranceServices)
    ? Typologies([Typologie.RFS])
    : TYPOLOGIE_MATCHERS.reduce(toTypologieMatchingName(source, matching), Typologies([]));

const checkingTypologieSourceValues = (source: DataSource, matching: LieuxMediationNumeriqueMatching): boolean[] | undefined =>
  matching.typologie?.map(
    (typo: Choice<Typologie>): boolean =>
      typo.colonnes != null && source[typo.colonnes[0] ?? ''] != null && source[typo.colonnes[0] ?? ''] !== ''
  );

const typologiesArePreset = (matching: LieuxMediationNumeriqueMatching): boolean =>
  matching.typologie?.[0]?.cible != null && matching.typologie[0].colonnes == null && matching.typologie[0].termes == null;

export const processTypologies = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Typologies =>
  ((checkingTypologieSourceValues(source, matching) ?? []).some((check: boolean): boolean => !check) &&
    !typologiesArePreset(matching)) ||
  matching.typologie?.at(0)?.cible == null
    ? inferTypologies(source, matching)
    : Typologies(Array.from(new Set(matching.typologie.reduce(appendTypologies(source), []))));
