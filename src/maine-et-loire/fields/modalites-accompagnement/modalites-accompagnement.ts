import { ModalitesAccompagnement } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { appendModaliteAccompagnementMatchingKeywords } from '../../../tools';
import { MODALITE_ACCOMPAGNEMENT_MAP_MAINE_ET_LOIRE } from './modalites-accompagnement.map';

export const processModalitesAccompagnement = (
  maineEtLoireLieuMediationNumeriqueAccompagnement: string
): ModalitesAccompagnement =>
  ModalitesAccompagnement(
    Array.from(MODALITE_ACCOMPAGNEMENT_MAP_MAINE_ET_LOIRE.keys()).reduce(
      appendModaliteAccompagnementMatchingKeywords(
        MODALITE_ACCOMPAGNEMENT_MAP_MAINE_ET_LOIRE,
        maineEtLoireLieuMediationNumeriqueAccompagnement
      ),
      []
    )
  );
