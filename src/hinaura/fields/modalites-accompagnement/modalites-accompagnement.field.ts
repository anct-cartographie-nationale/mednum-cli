import { ModaliteAccompagnement, ModalitesAccompagnement } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { HinauraLieuMediationNumerique } from '../../helper';

const MODALITE_ACCOMPAGNEMENT_MAP: Map<ModaliteAccompagnement, string[]> = new Map<ModaliteAccompagnement, string[]>([
  [ModaliteAccompagnement.DansUnAtelier, ['accompagnement en groupe']],
  [ModaliteAccompagnement.AMaPlace, ['faire à la place de']],
  [ModaliteAccompagnement.AvecDeLAide, ['accompagnement individuel']],
  [ModaliteAccompagnement.Seul, ['accès libre avec un accompagnement']]
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
  (
    modalitesAccompagnement: ModaliteAccompagnement[],
    modaliteAccompagnement: ModaliteAccompagnement
  ): ModaliteAccompagnement[] =>
    whenTypesAccompagnementProposesFromHinauraContainsKeyword(typesAccompagnementProposesFromHinaura, modaliteAccompagnement)
      ? [modaliteAccompagnement, ...modalitesAccompagnement]
      : modalitesAccompagnement;

export const processModalitesAccompagnement = (
  hinauraLieuMediationNumerique: HinauraLieuMediationNumerique
): ModalitesAccompagnement =>
  ModalitesAccompagnement(
    Array.from(MODALITE_ACCOMPAGNEMENT_MAP.keys()).reduce(
      appendModaliteAccompagnementMatchingKeywords(hinauraLieuMediationNumerique["Types d'accompagnement proposés"]),
      []
    )
  );
