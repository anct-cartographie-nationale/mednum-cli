import { ModaliteAcces, ModalitesAcces } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Choice, LieuxMediationNumeriqueMatching, DataSource } from '../../input';

const isAllowedTerm = (choice: Choice<ModaliteAcces>, sourceValue: string): boolean =>
  choice.sauf?.every((forbidden: string): boolean => !sourceValue.includes(forbidden)) ?? true;

const isTermFound =
  (sourceValue: string, choice: Choice<ModaliteAcces>) =>
  (found: boolean, term: string): boolean =>
    found || (sourceValue.includes(term.toLowerCase()) && isAllowedTerm(choice, sourceValue));

const containsOneOfTheTerms = (choice: Choice<ModaliteAcces>, sourceValue: string = ''): boolean =>
  choice.termes == null ? sourceValue !== '' : choice.termes.reduce(isTermFound(sourceValue.toLowerCase(), choice), false);

const appendModaliteAcces = (modalitesAcces: ModaliteAcces[], modaliteAcces?: ModaliteAcces): ModaliteAcces[] => [
  ...modalitesAcces,
  ...(modaliteAcces == null ? [] : [modaliteAcces])
];

const modalitesAccesForTerms =
  (choice: Choice<ModaliteAcces>, source: DataSource) =>
  (modalitesAcces: ModaliteAcces[], colonne: string): ModaliteAcces[] =>
    containsOneOfTheTerms(choice, source[colonne]?.toString())
      ? appendModaliteAcces(modalitesAcces, choice.cible)
      : modalitesAcces;

const appendModalitesAcces =
  (source: DataSource) =>
  (modalitesAcces: ModaliteAcces[], choice: Choice<ModaliteAcces>): ModaliteAcces[] => [
    ...modalitesAcces,
    ...(choice.colonnes ?? []).reduce(modalitesAccesForTerms(choice, source), [])
  ];

export const processModalitesAcces = (source: DataSource, matching: LieuxMediationNumeriqueMatching): ModalitesAcces =>
  ModalitesAcces(Array.from(new Set(matching.modalites_acces?.reduce(appendModalitesAcces(source), []))));
