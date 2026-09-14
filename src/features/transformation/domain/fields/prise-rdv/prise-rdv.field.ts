import { Url } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { LieuxMediationNumeriqueMatching, DataSource, Colonne } from '../../matching.js';

const canPorecessPriseRdv = (source: DataSource, priseRdv?: Colonne): priseRdv is Colonne =>
  priseRdv?.colonne != null && source[priseRdv.colonne] != null && source[priseRdv.colonne] !== '';

const fixUrl = (urlToFix: string) => urlToFix.replace('é', 'e');

export const processPriseRdv = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Url | undefined =>
  canPorecessPriseRdv(source, matching.prise_rdv)
    ? Url(fixUrl(source[matching.prise_rdv.colonne]?.toString() ?? ''))
    : undefined;
