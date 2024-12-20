import { Adresse, Url } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, DataSource, Colonne } from '../../input';
import { ratio } from 'fuzzball';

export type Erp = {
  name: string;
  siret: string;
  web_url: string;
  voie: string;
  numero: string;
  postal_code: string;
};

const getAccessibiliteFromAccesLibre = (
  source: DataSource,
  matching: LieuxMediationNumeriqueMatching,
  accesLibreData: Erp[],
  adresseProcessed: Adresse
): Url | undefined => {
  const erpMatchWithScores: Erp[] = accesLibreData
    .filter((erp: Erp): boolean => erp.postal_code === adresseProcessed.code_postal)
    .filter(
      (erp: Erp): boolean =>
        ratio(source[matching.nom.colonne]?.toString() ?? '', erp.name) >= 97 ||
        ratio(adresseProcessed.voie, erp.numero.concat(' ', erp.voie)) >= 97
    );

  const accesLibreUrlByFuzzyMatch: string | undefined =
    erpMatchWithScores.length === 1 ? erpMatchWithScores[0]?.web_url : undefined;

  const currentPivot: string | undefined =
    matching.pivot?.colonne != null && source[matching.pivot.colonne]?.toString() !== ''
      ? source[matching.pivot.colonne]?.toString()
      : undefined;

  const accesLibreUrlBySiretMatch: string | undefined =
    erpMatchWithScores.find((erp: Erp): boolean => erp.siret === currentPivot)?.web_url ?? undefined;

  const accesLibreUrl: string | undefined = accesLibreUrlBySiretMatch ?? accesLibreUrlByFuzzyMatch ?? undefined;

  return accesLibreUrl == null ? undefined : Url(accesLibreUrl);
};

const canProcessAccessibilite = (source: DataSource, accessibilite?: Colonne): accessibilite is Colonne =>
  accessibilite?.colonne != null && source[accessibilite.colonne] != null && source[accessibilite.colonne] !== '';

const fixUrl = (url: string): string => url.replace(/\(/gu, '%28').replace(/\)/gu, '%29');

export const processFicheAccesLibre = (
  source: DataSource,
  matching: LieuxMediationNumeriqueMatching,
  accesLibreData: Erp[],
  adresseProcessed: Adresse
): Url | undefined =>
  canProcessAccessibilite(source, matching.fiche_acces_libre)
    ? Url(fixUrl(source[matching.fiche_acces_libre.colonne]?.toString() ?? ''))
    : getAccessibiliteFromAccesLibre(source, matching, accesLibreData, adresseProcessed);
