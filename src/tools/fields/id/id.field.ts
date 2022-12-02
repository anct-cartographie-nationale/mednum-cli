import { Id } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, Source } from '../../input';

export const processId = (source: Source, matching: LieuxMediationNumeriqueMatching, index: number): Id =>
  Id((matching.id == null ? index.toString() : source[matching.id.colonne]) ?? index.toString());
