import { ModaliteAccompagnement, Service } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { processServices } from '../../../tools';
import { MaineEtLoireLieuMediationNumerique } from '../../helper';
import { SERVICES_MAP_MAINE_ET_LOIRE } from './services.map';

export const formatServicesField = (
  maineEtLoireLieuMediationNumerique: MaineEtLoireLieuMediationNumerique,
  modalitesAccompagnement: ModaliteAccompagnement[] = []
): Service[] =>
  Array.from(
    new Set([
      ...processServices(SERVICES_MAP_MAINE_ET_LOIRE, 'Démarches générales', modalitesAccompagnement),
      ...processServices(SERVICES_MAP_MAINE_ET_LOIRE, 'Accès internet', modalitesAccompagnement),
      ...processServices(SERVICES_MAP_MAINE_ET_LOIRE, 'Initiation aux outils numériques', modalitesAccompagnement),
      ...processServices(SERVICES_MAP_MAINE_ET_LOIRE, maineEtLoireLieuMediationNumerique.JT_MAT_Wif, modalitesAccompagnement),
      ...processServices(SERVICES_MAP_MAINE_ET_LOIRE, 'JT_MAT_Imp', modalitesAccompagnement),
      ...processServices(SERVICES_MAP_MAINE_ET_LOIRE, 'JT_MAT_Sca', modalitesAccompagnement),
      ...processServices(SERVICES_MAP_MAINE_ET_LOIRE, 'JT_MAT_Vid', modalitesAccompagnement),
      ...processServices(SERVICES_MAP_MAINE_ET_LOIRE, 'JT_MAT_Bor', modalitesAccompagnement),
      ...processServices(SERVICES_MAP_MAINE_ET_LOIRE, 'JT_MAT_3D', modalitesAccompagnement)
    ])
  );
