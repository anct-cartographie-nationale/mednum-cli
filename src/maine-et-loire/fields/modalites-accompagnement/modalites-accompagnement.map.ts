import { ModaliteAccompagnement } from '@gouvfr-anct/lieux-de-mediation-numerique';

export const MODALITE_ACCOMPAGNEMENT_MAP_MAINE_ET_LOIRE: Map<ModaliteAccompagnement, string[]> = new Map<
  ModaliteAccompagnement,
  string[]
>([
  [ModaliteAccompagnement.DansUnAtelier, ['oui']],
  [ModaliteAccompagnement.AMaPlace, ['oui']],
  [ModaliteAccompagnement.AvecDeLAide, ['oui']],
  [ModaliteAccompagnement.Seul, ['oui']]
]);
