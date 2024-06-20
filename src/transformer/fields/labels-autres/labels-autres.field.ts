import { Adresse, Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Choice, LieuxMediationNumeriqueMatching, DataSource, cibleAsDefault } from '../../input';
import { IsInQpv } from './qpv';
import { IsInZrr } from './zrr';

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
    containsOneOfTheTerms(choice, source[colonne]?.toString()) ? appendLabelAutre(labelsAutres, choice.cible) : labelsAutres;

const labelsAutresForTerms =
  (choice: Choice<string>, source: DataSource) =>
  (labelsAutres: string[], colonne: string): string[] =>
    isDefault(choice)
      ? appendLabelAutre(labelsAutres, choice.cible)
      : findAndAppendLabelsAutres(choice, source)(labelsAutres, colonne);

const toLabelAutreFrom =
  (source: DataSource) =>
  (columnName: string): string | undefined =>
    source[columnName]?.toString();

const onlyDefined = (valueToBeDefined: string | undefined): valueToBeDefined is string => valueToBeDefined != null;

const extractLabelsAutresFromSource = (source: DataSource, colonnes: string[] = []): string[] =>
  colonnes.map(toLabelAutreFrom(source)).filter(onlyDefined);

const labelsAutresCibleMatchingTerms = (labelsAutres: string[], choice: Choice<string>, source: DataSource): string[] => [
  ...labelsAutres,
  ...(choice.colonnes ?? cibleAsDefault(choice)).reduce(labelsAutresForTerms(choice, source), [])
];

const appendLabelsAutres =
  (source: DataSource) =>
  (labelsAutres: string[], choice: Choice<string>): string[] =>
    choice.cible == null
      ? extractLabelsAutresFromSource(source, choice.colonnes)
      : labelsAutresCibleMatchingTerms(labelsAutres, choice, source);

const shouldAddQPV =
  (isInQpv: IsInQpv) =>
  (adresse?: Adresse, localisation?: Localisation): boolean =>
    adresse?.code_insee != null && localisation != null && isInQpv(adresse.code_insee, localisation);

const shouldAddZRR =
  (isInZrr: IsInZrr) =>
  (adresse?: Adresse): boolean =>
    adresse?.code_insee != null && isInZrr(adresse.code_insee);

const labelsToAdd =
  (isInQpv: IsInQpv, isInZrr: IsInZrr) =>
  (adresse?: Adresse, localisation?: Localisation): string[] => [
    ...(shouldAddQPV(isInQpv)(adresse, localisation) ? ['QPV'] : []),
    ...(shouldAddZRR(isInZrr)(adresse) ? ['ZRR'] : [])
  ];

const appendExtraLabels =
  (isInQpv: IsInQpv, isInZrr: IsInZrr) =>
  (labelsAutres: string[], adresse?: Adresse, localisation?: Localisation): string[] => [
    ...labelsToAdd(isInQpv, isInZrr)(adresse, localisation),
    ...labelsAutres
  ];

const onlyNonEmptyLabels = (label: string): boolean => label !== '';

const labelsFromSource = (matching: LieuxMediationNumeriqueMatching, source: DataSource): string[] =>
  Array.from(new Set(matching.labels_autres?.reduce(appendLabelsAutres(source), []))).filter(onlyNonEmptyLabels);

export const processLabelsAutres = (
  source: DataSource,
  matching: LieuxMediationNumeriqueMatching,
  isInQpv: IsInQpv,
  isInZrr: IsInZrr,
  adresse?: Adresse,
  localisation?: Localisation
): string[] => [
  ...Array.from(new Set(appendExtraLabels(isInQpv, isInZrr)(labelsFromSource(matching, source), adresse, localisation)))
];
