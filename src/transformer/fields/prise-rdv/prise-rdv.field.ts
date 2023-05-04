import { Url } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, DataSource, Colonne } from '../../input';

const canPorecessPriseRdv = (source: DataSource, priseRdv?: Colonne): priseRdv is Colonne =>
  priseRdv?.colonne != null && source[priseRdv.colonne] != null && source[priseRdv.colonne] !== '';

export const processPriseRdv = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Url | undefined =>
  canPorecessPriseRdv(source, matching.prise_rdv) ? Url(source[matching.prise_rdv.colonne] ?? '') : undefined;
