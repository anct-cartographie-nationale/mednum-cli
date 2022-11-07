import { Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { HinauraLieuMediationNumerique } from '../../helper';

export const processLocalisation = (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique): Localisation =>
  Localisation({
    latitude: hinauraLieuMediationNumerique.bf_latitude,
    longitude: hinauraLieuMediationNumerique.bf_longitude
  });
