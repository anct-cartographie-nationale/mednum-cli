import { ModalitesAccompagnement } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { appendModaliteAccompagnementMatchingKeywords } from '../../../tools';
import { HinauraLieuMediationNumerique } from '../../helper';
import { MODALITE_ACCOMPAGNEMENT_MAP_HINAURA } from './modalites-accompagnement.map';

export const processModalitesAccompagnement = (
  hinauraLieuMediationNumerique: HinauraLieuMediationNumerique
): ModalitesAccompagnement =>
  ModalitesAccompagnement(
    Array.from(MODALITE_ACCOMPAGNEMENT_MAP_HINAURA.keys()).reduce(
      appendModaliteAccompagnementMatchingKeywords(
        MODALITE_ACCOMPAGNEMENT_MAP_HINAURA,
        hinauraLieuMediationNumerique["Types d'accompagnement proposés"]
      ),
      []
    )
  );
