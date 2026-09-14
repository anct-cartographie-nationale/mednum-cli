import { ModaliteAcces } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { DataSource, LieuxMediationNumeriqueMatching } from '../../matching.js';
import { processModalitesAcces } from '../modalites-acces/modalites-acces.field.js';

export const isPrive = (source: DataSource, matching: LieuxMediationNumeriqueMatching): boolean =>
  processModalitesAcces(source, matching).includes(ModaliteAcces.PasDePublic);
