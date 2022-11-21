import { ModaliteAccompagnement } from '@gouvfr-anct/lieux-de-mediation-numerique';

// const MODALITE_ACCOMPAGNEMENT_MAP: Map<ModaliteAccompagnement, string[]> = new Map<ModaliteAccompagnement, string[]>([
//   [ModaliteAccompagnement.DansUnAtelier, ['accompagnement en groupe']],
//   [ModaliteAccompagnement.AMaPlace, ['faire à la place de']],
//   [ModaliteAccompagnement.AvecDeLAide, ['accompagnement individuel']],
//   [ModaliteAccompagnement.Seul, ['accès libre avec un accompagnement']]
// ]);

const findIncludedKeywords =
  (typesAccompagnementProposesFromHinaura: string) =>
  (isKeywordFound: boolean, keyword: string): boolean =>
    isKeywordFound || typesAccompagnementProposesFromHinaura.toLocaleLowerCase().includes(keyword);

const whenTypesAccompagnementProposesFromHinauraContainsKeyword = (
  modaliteMap: any,
  typesAccompagnementProposesFromHinaura: string,
  modaliteAccompagnement: ModaliteAccompagnement
): boolean =>
  modaliteMap.get(modaliteAccompagnement)?.reduce(findIncludedKeywords(typesAccompagnementProposesFromHinaura), false) ?? false;

export const appendModaliteAccompagnementMatchingKeywords =
  (modaliteMap: any, typesAccompagnementProposesFromHinaura: string) =>
  (
    modalitesAccompagnement: ModaliteAccompagnement[],
    modaliteAccompagnement: ModaliteAccompagnement
  ): ModaliteAccompagnement[] =>
    whenTypesAccompagnementProposesFromHinauraContainsKeyword(
      modaliteMap,
      typesAccompagnementProposesFromHinaura,
      modaliteAccompagnement
    )
      ? [modaliteAccompagnement, ...modalitesAccompagnement]
      : modalitesAccompagnement;

// export const processModalitesAccompagnement = (
//   hinauraLieuMediationNumerique: HinauraLieuMediationNumerique
// ): ModalitesAccompagnement =>
//   ModalitesAccompagnement(
//     Array.from(MODALITE_ACCOMPAGNEMENT_MAP.keys()).reduce(
//       appendModaliteAccompagnementMatchingKeywords(hinauraLieuMediationNumerique["Types d'accompagnement proposés"]),
//       []
//     )
//   );
