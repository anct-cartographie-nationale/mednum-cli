import { Id } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { sha256 } from '../../../../../libraries/hash';
import type { LieuxMediationNumeriqueMatching, DataSource } from '../../matching';
import { voieField } from '../adresse/clean-voie';

const LONGUEUR_DE_L_EMPREINTE = 16;

const normaliser = (valeur: string): string =>
  (valeur ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, ' ')
    .trim();

const valeurDe = (source: DataSource, colonne?: string | string[]): string =>
  colonne == null
    ? ''
    : [colonne]
        .flat()
        .map((nom: string): string => source[nom]?.toString() ?? '')
        .filter(Boolean)
        .join(' ');

/**
 * L'empreinte se calcule sur l'adresse **de la source**, jamais sur celle que publie le lieu : la
 * seconde est celle que rend la Base Adresse Nationale, qui révise ses réponses au fil de son
 * référentiel et de l'état du cache. Mesuré le 21 septembre : neuf adresses publiées sur
 * cinquante-trois ont changé en une après-midi, aucune adresse de source en cinq jours.
 */
const empreinteDuContenu = (source: DataSource, matching: LieuxMediationNumeriqueMatching): string =>
  sha256(
    [
      normaliser(valeurDe(source, matching.nom.colonne)),
      normaliser(valeurDe(source, matching.commune?.colonne)),
      normaliser(voieField(source, matching.adresse))
    ].join('|')
  ).slice(0, LONGUEUR_DE_L_EMPREINTE);

/**
 * Un identifiant absent se dérive du contenu, jamais de l'index de ligne : l'index change dès que
 * le producteur réordonne son fichier, et un identifiant qui bouge casse les liens qui le citent.
 * Le cas vaut pour une source sans colonne d'identifiant comme pour une ligne dont la colonne est
 * vide — cinquante-trois lieux de Loire-Atlantique partageaient ainsi le même identifiant.
 */
const idFragment = (matching: LieuxMediationNumeriqueMatching, source: DataSource): string => {
  const declare: string = matching.id == null ? '' : (source[matching.id.colonne]?.toString() ?? '');

  return declare === '' ? empreinteDuContenu(source, matching) : declare;
};

const sourceIfAny = (source: DataSource, sourceName: string, colonne?: string): string =>
  colonne == null || source[colonne] == null || (source[colonne] as string) === '' ? sourceName : (source[colonne] as string);

export const processId = (source: DataSource, matching: LieuxMediationNumeriqueMatching, sourceName: string): Id =>
  Id(`${sourceIfAny(source, sourceName, matching.source?.colonne)}_${idFragment(matching, source)}`.replace(/\s+/g, '-'));
