import { ModaliteAccompagnement } from '@gouvfr-anct/lieux-de-mediation-numerique';

export const MODALITE_ACCOMPAGNEMENT_MAP_HINAURA: Map<ModaliteAccompagnement, string[]> = new Map<
  ModaliteAccompagnement,
  string[]
>([
  [ModaliteAccompagnement.DansUnAtelier, ['accompagnement en groupe']],
  [ModaliteAccompagnement.AMaPlace, ['faire à la place de']],
  [ModaliteAccompagnement.AvecDeLAide, ['accompagnement individuel']],
  [ModaliteAccompagnement.Seul, ['accès libre avec un accompagnement']]
]);
