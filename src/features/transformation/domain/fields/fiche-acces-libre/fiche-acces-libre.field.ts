import { type Adresse, FicheAccesLibre, type Typologies } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { AccesLibreErp } from '../../../../../libraries/acces-libre';
import type { LieuxMediationNumeriqueMatching, DataSource, Colonne } from '../../matching';
import { adresseExacte, adresseExacteDuLieu } from './adresse-exacte';
import { ficheAttribuee } from './attribution';

export type AccesLibreIndex = Map<string, AccesLibreErp[]>;

export const accesLibreIndex = (erps: AccesLibreErp[]): AccesLibreIndex =>
  erps.reduce((index: AccesLibreIndex, erp: AccesLibreErp): AccesLibreIndex => {
    const cle: string | undefined = erp.codeInsee === '' ? undefined : adresseExacte(erp.codeInsee, erp.numero, erp.voie);

    return cle == null ? index : index.set(cle, [...(index.get(cle) ?? []), erp]);
  }, new Map<string, AccesLibreErp[]>());

const ficheDeLAdresse = (
  index: AccesLibreIndex,
  adresse: Adresse,
  nom: string,
  typologies?: Typologies
): AccesLibreErp | undefined => {
  if (adresse.code_insee == null) return undefined;

  const cle: string | undefined = adresseExacteDuLieu(adresse.code_insee, adresse.voie);

  if (cle == null) return undefined;

  return ficheAttribuee(nom, typologies, index.get(cle) ?? []);
};

const getAccessibiliteFromAccesLibre = (
  index: AccesLibreIndex,
  adresse: Adresse,
  nom: string,
  typologies?: Typologies
): FicheAccesLibre | undefined => {
  const erp: AccesLibreErp | undefined = ficheDeLAdresse(index, adresse, nom, typologies);

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
  adresseProcessed: Adresse,
  nom: string,
  typologies?: Typologies
): FicheAccesLibre | undefined =>
  canProcessAccessibilite(source, matching.fiche_acces_libre)
    ? (FicheAccesLibre.safe(fixUrl(source[matching.fiche_acces_libre.colonne]?.toString() ?? '')) ?? undefined)
    : getAccessibiliteFromAccesLibre(accesLibre, adresseProcessed, nom, typologies);
