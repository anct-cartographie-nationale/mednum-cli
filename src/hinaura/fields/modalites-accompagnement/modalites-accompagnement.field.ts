import { ModaliteAccompagnement } from '@gouvfr-anct/lieux-de-mediation-numerique';

const appendModaliteAccompagnement = (modalitesAccompagnement: string, newModalitesAccompagnement: string): string =>
  [newModalitesAccompagnement, ...(modalitesAccompagnement === '' ? [] : [modalitesAccompagnement])].join(',');

const MODALITE_ACCOMPAGNEMENT_MAP: Map<ModaliteAccompagnement, string[]> = new Map<ModaliteAccompagnement, string[]>([
  [ModaliteAccompagnement.DansUnAtelier, ['accompagnement en groupe']],
  [ModaliteAccompagnement.AMaPlace, ['faire à la place de']],
  [ModaliteAccompagnement.AvecDeLAide, ['accompagnement individuel', 'accès libre avec un accompagnement']],
  [ModaliteAccompagnement.Seul, ['accompagnement individuel', 'accès libre avec un accompagnement']]
]);

const findIncludedKeywords =
  (typesAccompagnementProposesFromHinaura: string) =>
  (isKeywordFound: boolean, keyword: string): boolean =>
    isKeywordFound || typesAccompagnementProposesFromHinaura.toLocaleLowerCase().includes(keyword);

const whenTypesAccompagnementProposesFromHinauraContainsKeyword = (
  typesAccompagnementProposesFromHinaura: string,
  modaliteAccompagnement: ModaliteAccompagnement
): boolean =>
  MODALITE_ACCOMPAGNEMENT_MAP.get(modaliteAccompagnement)?.reduce(
    findIncludedKeywords(typesAccompagnementProposesFromHinaura),
    false
  ) ?? false;

const appendModaliteAccompagnementMatchingKeywords =
  (typesAccompagnementProposesFromHinaura: string) =>
  (concatModalitesAccompagnement: string, modaliteAccompagnement: ModaliteAccompagnement): string =>
    whenTypesAccompagnementProposesFromHinauraContainsKeyword(typesAccompagnementProposesFromHinaura, modaliteAccompagnement)
      ? appendModaliteAccompagnement(concatModalitesAccompagnement, modaliteAccompagnement)
      : concatModalitesAccompagnement;

export const processModalitesAccompagnement = (typesAccompagnementProposesFromHinaura: string): string =>
  Array.from(MODALITE_ACCOMPAGNEMENT_MAP.keys()).reduce(
    appendModaliteAccompagnementMatchingKeywords(typesAccompagnementProposesFromHinaura),
    ''
  );
