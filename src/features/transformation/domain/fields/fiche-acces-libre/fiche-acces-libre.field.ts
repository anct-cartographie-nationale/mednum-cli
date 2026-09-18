import { type Adresse, FicheAccesLibre } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { AccesLibreErp } from '../../../../../libraries/acces-libre';
import type { LieuxMediationNumeriqueMatching, DataSource, Colonne } from '../../matching';
import { ACTIVITES_ACCUEILLANTES } from './activites-accueillantes';
import { adresseExacte, adresseExacteDuLieu } from './adresse-exacte';

export type AccesLibreIndex = Map<string, AccesLibreErp[]>;

export const accesLibreIndex = (erps: AccesLibreErp[]): AccesLibreIndex =>
  erps.reduce((index: AccesLibreIndex, erp: AccesLibreErp): AccesLibreIndex => {
    const cle: string | undefined = erp.codeInsee === '' ? undefined : adresseExacte(erp.codeInsee, erp.numero, erp.voie);

    return cle == null ? index : index.set(cle, [...(index.get(cle) ?? []), erp]);
  }, new Map<string, AccesLibreErp[]>());

const estAccueillante = (erp: AccesLibreErp): boolean => ACTIVITES_ACCUEILLANTES.includes(erp.activite);

const ficheDeLAdresse = (index: AccesLibreIndex, adresse: Adresse): AccesLibreErp | undefined => {
  if (adresse.code_insee == null) return undefined;

  const cle: string | undefined = adresseExacteDuLieu(adresse.code_insee, adresse.voie);

  if (cle == null) return undefined;

  const candidats: AccesLibreErp[] = (index.get(cle) ?? []).filter(estAccueillante);

  return candidats.length === 1 ? candidats[0] : undefined;
};

const getAccessibiliteFromAccesLibre = (index: AccesLibreIndex, adresse: Adresse): FicheAccesLibre | undefined => {
  const erp: AccesLibreErp | undefined = ficheDeLAdresse(index, adresse);

  return erp == null ? undefined : (FicheAccesLibre.safe(erp.ficheUrl) ?? undefined);
};

const canProcessAccessibilite = (source: DataSource, accessibilite?: Colonne): accessibilite is Colonne => {
  return (
    accessibilite?.colonne != null &&
    source[accessibilite.colonne] != null &&
    source[accessibilite.colonne] !== '' &&
    !(source[accessibilite.colonne] as string).startsWith('https://acceslibre.beta.gouv.fr/static/js/widget.js')
  );
};

const fixUrl = (url: string): string => url.replace(/\(/g, '%28').replace(/\)/g, '%29');

export const processFicheAccesLibre = (
  source: DataSource,
  matching: LieuxMediationNumeriqueMatching,
  accesLibre: AccesLibreIndex,
  adresseProcessed: Adresse
): FicheAccesLibre | undefined =>
  canProcessAccessibilite(source, matching.fiche_acces_libre)
    ? (FicheAccesLibre.safe(fixUrl(source[matching.fiche_acces_libre.colonne]?.toString() ?? '')) ?? undefined)
    : getAccessibiliteFromAccesLibre(accesLibre, adresseProcessed);
