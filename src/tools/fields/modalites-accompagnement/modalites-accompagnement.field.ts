import { ModaliteAccompagnement, ModalitesAccompagnement } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Choice, LieuxMediationNumeriqueMatching, Source } from '../../input';

const isAllowedTerm = (choice: Choice<ModaliteAccompagnement>, sourceValue: string): boolean =>
  choice.sauf?.every((forbidden: string): boolean => !sourceValue.includes(forbidden)) ?? true;

const isTermFound =
  (sourceValue: string, choice: Choice<ModaliteAccompagnement>) =>
  (found: boolean, term: string): boolean =>
    found || (sourceValue.includes(term.toLowerCase()) && isAllowedTerm(choice, sourceValue));

const containsOneOfTheTerms = (choice: Choice<ModaliteAccompagnement>, sourceValue: string = ''): boolean =>
  choice.termes == null ? sourceValue !== '' : choice.termes.reduce(isTermFound(sourceValue.toLowerCase(), choice), false);

const appendModaliteAccompagnement = (
  modalitesAccompagnement: ModaliteAccompagnement[],
  modaliteAccompagnement?: ModaliteAccompagnement
): ModaliteAccompagnement[] => [
  ...modalitesAccompagnement,
  ...(modaliteAccompagnement == null ? [] : [modaliteAccompagnement])
];

const modalitesAccompagnementForTerms =
  (choice: Choice<ModaliteAccompagnement>, source: Source) =>
  (modalitesAccompagnement: ModaliteAccompagnement[], colonne: string): ModaliteAccompagnement[] =>
    containsOneOfTheTerms(choice, source[colonne])
      ? appendModaliteAccompagnement(modalitesAccompagnement, choice.cible)
      : modalitesAccompagnement;

const appendModalitesAccompagnement =
  (source: Source) =>
  (modalitesAccompagnement: ModaliteAccompagnement[], choice: Choice<ModaliteAccompagnement>): ModaliteAccompagnement[] =>
    [...modalitesAccompagnement, ...(choice.colonnes ?? []).reduce(modalitesAccompagnementForTerms(choice, source), [])];

export const processModalitesAccompagnement = (
  source: Source,
  matching: LieuxMediationNumeriqueMatching
): ModalitesAccompagnement =>
  ModalitesAccompagnement(
    Array.from(new Set(matching.modaliteAccompagnement?.reduce(appendModalitesAccompagnement(source), [])))
  );
