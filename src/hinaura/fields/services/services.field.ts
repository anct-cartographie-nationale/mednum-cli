import { ModaliteAccompagnement, Service, Services } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { processServices } from '../../../tools';
import { HinauraLieuMediationNumerique } from '../../helper';
import { SERVICES_MAP_HINAURA } from './services.map';

export const formatServicesField = (
  hinauraLieuMediationNumerique: HinauraLieuMediationNumerique,
  modalitesAccompagnement: ModaliteAccompagnement[]
): Services =>
  Services(
    Array.from(
      new Set([
        ...processServices(SERVICES_MAP_HINAURA, hinauraLieuMediationNumerique['À disposition'], modalitesAccompagnement),
        ...processServices(
          SERVICES_MAP_HINAURA,
          hinauraLieuMediationNumerique['Formations compétences de base proposées'],
          modalitesAccompagnement
        ),
        ...processServices(
          SERVICES_MAP_HINAURA,
          hinauraLieuMediationNumerique['Comprendre et Utiliser les sites d’accès aux droits proposées'],
          modalitesAccompagnement
        ),
        ...processServices(
          SERVICES_MAP_HINAURA,
          hinauraLieuMediationNumerique['Sensibilisations culture numérique'],
          modalitesAccompagnement
        )
      ])
    )
  );
