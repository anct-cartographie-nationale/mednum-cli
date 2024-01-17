/* eslint-disable @typescript-eslint/naming-convention */

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
        ratio(source[matching.nom.colonne]?.toString() ?? '', erp.name) >= 80 ||
        ratio(adresseProcessed.voie, erp.numero.concat(' ', erp.voie)) >= 80
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

const accessibiliteUrlIsValid = (urlAccessibilite: string): boolean => {
  try {
    Url(urlAccessibilite);
    return true;
  } catch {
    return false;
  }
};

export const processAccessibilite = (
  source: DataSource,
  matching: LieuxMediationNumeriqueMatching,
  accesLibreData: Erp[],
  adresseProcessed: Adresse
): Url | undefined =>
  canProcessAccessibilite(source, matching.accessibilite) &&
  accessibiliteUrlIsValid(source[matching.accessibilite.colonne] as string)
    ? Url(source[matching.accessibilite.colonne]?.toString() ?? '')
    : getAccessibiliteFromAccesLibre(source, matching, accesLibreData, adresseProcessed);
