import { ModaliteAcces } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DataSource, LieuxMediationNumeriqueMatching } from '../../input';
import { processModalitesAcces } from '../modalites-acces/modalites-acces.field';

export const isPrive = (source: DataSource, matching: LieuxMediationNumeriqueMatching): boolean =>
  processModalitesAcces(source, matching).includes(ModaliteAcces.PasDePublic);
