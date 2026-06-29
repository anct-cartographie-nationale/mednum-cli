import { Adresse, Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Choice, LieuxMediationNumeriqueMatching, DataSource, cibleAsDefault } from '../../input';
import { IsInQpv } from './qpv';
import { IsInFrr } from './frr';

const isAllowedTerm = (choice: Choice<string>, sourceValue: string): boolean =>
  choice.sauf?.every((forbidden: string): boolean => !sourceValue.includes(forbidden)) ?? true;

const isTermFound =
  (sourceValue: string, choice: Choice<string>) =>
  (found: boolean, term: string): boolean =>
    found || (sourceValue.includes(term.toLowerCase()) && isAllowedTerm(choice, sourceValue));

const containsOneOfTheTerms = (choice: Choice<string>, sourceValue: string = ''): boolean =>
  choice.termes == null ? sourceValue !== '' : choice.termes.reduce(isTermFound(sourceValue.toLowerCase(), choice), false);

const appendAutreFormationLabel = (autresFormationsLabels: string[], autreFormationLabel?: string): string[] => [
  ...autresFormationsLabels,
  ...(autreFormationLabel == null ? [] : [autreFormationLabel])
];

const isDefault = (choice: Choice<string>): boolean => choice.colonnes == null;

const findAndAppendAutresFormationsLabels =
  (choice: Choice<string>, source: DataSource) =>
  (autresFormationsLabels: string[], colonne: string): string[] =>
    containsOneOfTheTerms(choice, source[colonne]?.toString())
      ? appendAutreFormationLabel(autresFormationsLabels, choice.cible)
      : autresFormationsLabels;

const autresFormationsLabelsForTerms =
  (choice: Choice<string>, source: DataSource) =>
  (autresFormationsLabels: string[], colonne: string): string[] =>
    isDefault(choice)
      ? appendAutreFormationLabel(autresFormationsLabels, choice.cible)
      : findAndAppendAutresFormationsLabels(choice, source)(autresFormationsLabels, colonne);

const toAutreFormationLabelFrom =
  (source: DataSource) =>
  (columnName: string): string | undefined =>
    source[columnName]?.toString();

const onlyDefined = (valueToBeDefined: string | undefined): valueToBeDefined is string => valueToBeDefined != null;

const extractAutresFormationsLabelsFromSource = (source: DataSource, colonnes: string[] = []): string[] =>
  colonnes.map(toAutreFormationLabelFrom(source)).filter(onlyDefined);

const autresFormationsLabelsCibleMatchingTerms = (
  autresFormationsLabels: string[],
  choice: Choice<string>,
  source: DataSource
): string[] => [
  ...autresFormationsLabels,
  ...(choice.colonnes ?? cibleAsDefault(choice)).reduce(autresFormationsLabelsForTerms(choice, source), [])
];

const appendAutresFormationsLabels =
  (source: DataSource) =>
  (autresFormationsLabels: string[], choice: Choice<string>): string[] =>
    choice.cible == null
      ? extractAutresFormationsLabelsFromSource(source, choice.colonnes)
      : autresFormationsLabelsCibleMatchingTerms(autresFormationsLabels, choice, source);

const shouldAddQPV =
  (isInQpv: IsInQpv) =>
  (adresse?: Adresse, localisation?: Localisation): boolean =>
    adresse?.code_insee != null && localisation != null && isInQpv(adresse.code_insee, localisation);

const shouldAddFRR =
  (isInFrr: IsInFrr) =>
  (adresse?: Adresse): boolean =>
    adresse?.code_insee != null && isInFrr(adresse.code_insee);

const labelsToAdd =
  (isInQpv: IsInQpv, isInFrr: IsInFrr) =>
  (adresse?: Adresse, localisation?: Localisation): string[] => [
    ...(shouldAddQPV(isInQpv)(adresse, localisation) ? ['QPV'] : []),
    ...(shouldAddFRR(isInFrr)(adresse) ? ['FRR'] : [])
  ];

const appendExtraLabels =
  (isInQpv: IsInQpv, isInFrr: IsInFrr) =>
  (autresFormationsLabels: string[], adresse?: Adresse, localisation?: Localisation): string[] => [
    ...labelsToAdd(isInQpv, isInFrr)(adresse, localisation),
    ...autresFormationsLabels
  ];

const onlyNonEmptyLabels = (label: string): boolean => label !== '';

// ZRR a été remplacé par FRR (France Ruralités Revitalisation) au 1er juillet 2024 ; on ignore ce label
// obsolète lorsqu'une source continue de le fournir, seul le FRR calculé fait foi.
const OBSOLETE_LABELS: string[] = ['zrr'];

const isNotObsoleteLabel = (label: string): boolean => !OBSOLETE_LABELS.includes(label.trim().toLowerCase());

const labelsFromSource = (matching: LieuxMediationNumeriqueMatching, source: DataSource): string[] =>
  Array.from(new Set(matching.autres_formations_labels?.reduce(appendAutresFormationsLabels(source), []))).filter(
    onlyNonEmptyLabels
  );

const labelWithPipe = (label: string) => label.split('|');

export const processAutresFormationsLabels = (
  source: DataSource,
  matching: LieuxMediationNumeriqueMatching,
  isInQpv: IsInQpv,
  isInFrr: IsInFrr,
  adresse?: Adresse,
  localisation?: Localisation
): string[] => [
  ...Array.from(
    new Set(
      appendExtraLabels(isInQpv, isInFrr)(
        labelsFromSource(matching, source).flatMap(labelWithPipe).filter(isNotObsoleteLabel),
        adresse,
        localisation
      )
    )
  )
];
