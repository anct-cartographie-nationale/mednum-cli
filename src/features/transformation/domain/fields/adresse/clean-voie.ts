import type { Colonne, DataSource, Jonction } from '../../matching';
import type { CleanOperation } from './clean-operations';

const REMOVE_MULTIPLE_SPACES_IN_VOIE: CleanOperation = {
  name: 'replace multiple spaces with single space',
  selector: /\s+/u,
  fix: (toFix: string): string => toFix.replace(/\s+/gu, ' ')
};

const FIX_WRONG_SINGLE_QUOTE_IN_VOIE: CleanOperation = {
  name: 'fix wrong single quote',
  selector: //u,
  fix: (toFix: string): string => toFix.replace(//gu, "'")
};

const FIX_INVALID_NUMERO_IN_VOIE: CleanOperation = {
  name: 'fix wrong single quote',
  selector: /^(0 Rue|00 Rue)/u,
  fix: (toFix: string): string => toFix.replace(/^(0 Rue|00 Rue)/gu, 'Rue')
};

const REMOVE_FORBIDDEN_CHARS_IN_VOIE: CleanOperation = {
  name: 'replace forbidden chars with empty string',
  selector: /[",²]/u,
  fix: (toFix: string): string => toFix.replace(/[",²]/gu, '')
};

const REMOVE_MULTILINES_IN_VOIE: CleanOperation = {
  name: 'replace carriage returns with space',
  selector: /\n|\\n/u,
  fix: (toFix: string): string => toFix.replace(/\n|\\n/u, ' ')
};

const REMOVE_NULL_PREFIX_IN_VOIE: CleanOperation = {
  name: 'remove null prefix in voie',
  selector: /^[Nn][Uu][Ll][Ll]\s+/u,
  fix: (toFix: string): string => toFix.replace(/^[Nn][Uu][Ll][Ll]\s+/u, '')
};

const REMOVE_ONLY_ZIPCODE_IN_VOIE: CleanOperation = {
  name: 'remove voie that is only a zip code and city',
  selector: /^\d{5}(\s.*)?$/,
  fix: (): string => ''
};

const REMOVE_INCOMPLETE_ADDRESS_IN_VOIE: CleanOperation = {
  name: 'remove incomplete address in voie',
  selector:
    /^(C\/O A\.THEVENIER LAFARGE73 AVENUE DU MONT BLANCBAT B|Médiathèque de Champagney Grande rue|Rue|1 - 3|Residence les 3 C|null|-)\s*$/,
  fix: (): string => ''
};

const REMOVE_ZIPCODE_AND_FOLLOWING_TEXT_IN_VOIE: CleanOperation = {
  name: 'remove zipcode and following text in voie',
  selector: /^(?<voie>.*?)\s\d{5}\s\w+/u,
  fix: (toFix: string): string => /^(?<voie>.*?)\s\d{5}\s\w+/u.exec(toFix)?.groups?.['voie'] ?? toFix
};

/**
 * Les types de voie abrégés coûtent au géocodage : la Base Adresse Nationale ignore les
 * accents mais pas les abréviations, si bien que « Pl de la Liberte » ne se rapproche de
 * « Place de la Liberté » qu'à 0,73 quand la forme développée atteint 0,95.
 */
const STREET_TYPE_ABBREVIATIONS: Record<string, string> = {
  ALL: 'Allée',
  AV: 'Avenue',
  AVE: 'Avenue',
  BD: 'Boulevard',
  BLD: 'Boulevard',
  CHE: 'Chemin',
  CHEM: 'Chemin',
  CRS: 'Cours',
  DR: 'Docteur',
  FG: 'Faubourg',
  GAL: 'Général',
  HAM: 'Hameau',
  IMP: 'Impasse',
  LOT: 'Lotissement',
  MAL: 'Maréchal',
  MTE: 'Montée',
  PAS: 'Passage',
  PDT: 'Président',
  PL: 'Place',
  QU: 'Quai',
  RES: 'Résidence',
  RTE: 'Route',
  SEN: 'Sentier',
  SQ: 'Square',
  ST: 'Saint',
  STE: 'Sainte',
  VLA: 'Villa'
};

/**
 * `toCleanField` reconstruit le sélecteur avec le seul drapeau `u` : un motif qui compte sur
 * `i` ne serait jamais reconnu. La casse est donc portée par le motif lui même.
 *
 * Les bornes de mot `\b` ne conviennent pas ici : sous `u` elles tiennent une lettre accentuée
 * pour une non lettre, si bien que `All` serait reconnu au début d'`Allée` et la développerait
 * en `Alléeée`. Les regards sur `\p{L}` couvrent tout l'alphabet.
 */
const anyCaseOf = (abbreviation: string): string =>
  [abbreviation, `${abbreviation[0]}${abbreviation.slice(1).toLowerCase()}`, abbreviation.toLowerCase()].join('|');

const ABBREVIATION_PATTERN: RegExp = new RegExp(
  `(?<![\\p{L}\\d])(${Object.keys(STREET_TYPE_ABBREVIATIONS).map(anyCaseOf).join('|')})\\.?(?![\\p{L}\\d])`,
  'gu'
);

const EXPAND_ABBREVIATIONS_IN_VOIE: CleanOperation = {
  name: 'expand street type abbreviations',
  selector: ABBREVIATION_PATTERN,
  fix: (toFix: string): string =>
    toFix.replace(
      ABBREVIATION_PATTERN,
      (abbreviation: string): string => STREET_TYPE_ABBREVIATIONS[abbreviation.replace('.', '').toUpperCase()] ?? abbreviation
    )
};

/**
 * La Base Adresse Nationale écrit le suffixe collé au numéro — « 1BIS » — et pénalise l'espace :
 * « 1 bis rue des Ajoncs » se rapproche à 0,82 quand « 1bis rue des Ajoncs » atteint 0,97, pour
 * la même adresse. Mesuré systématique sur les deux cent dix sept adresses du jeu national qui
 * portent ce motif.
 */
const JOIN_NUMBER_SUFFIX_IN_VOIE: CleanOperation = {
  name: 'join house number and its bis, ter or quater suffix',
  selector: /^\s*\d+\s+([Bb][Ii][Ss]|[Tt][Ee][Rr]|[Qq][Uu][Aa][Tt][Ee][Rr])\b/u,
  fix: (toFix: string): string =>
    toFix.replace(
      /^(\s*\d+)\s+([Bb][Ii][Ss]|[Tt][Ee][Rr]|[Qq][Uu][Aa][Tt][Ee][Rr])\b/u,
      (_: string, numero: string, suffixe: string): string => `${numero}${suffixe.toLowerCase()}`
    )
};

const REMOVE_HEADING_AND_TRAILING_SPACES_IN_VOIE: CleanOperation = {
  name: 'remove heading and trailing spaces',
  selector: /^\s+|\s+$/u,
  fix: (toFix: string): string => toFix.trim()
};

const FIX_WRONG_ENCODING_IN_VOIE: CleanOperation = {
  name: 'fix wrong encoding',
  selector: /Ã[\x80-\xFF]/,
  fix: (toFix: string): string => Buffer.from(toFix, 'latin1').toString('utf8')
};

/**
 * Une fourchette de numéros ne désigne aucun point : la Base Adresse Nationale ne sait pas
 * situer « 211-213 boulevard Vincent Auriol », elle situe « 211 boulevard Vincent Auriol ».
 */
const KEEP_FIRST_NUMBER_OF_RANGE_IN_VOIE: CleanOperation = {
  name: 'keep the first number of a range',
  selector: /^\s*\d+\s*[-–/]\s*\d+/u,
  fix: (toFix: string): string => toFix.replace(/^(\s*\d+)\s*[-–/]\s*\d+/u, '$1')
};

/**
 * Ce qu'une parenthèse porte — un étage, une porte, un bâtiment — relève du complément
 * d'adresse et brouille le rapprochement.
 */
const REMOVE_PARENTHESES_IN_VOIE: CleanOperation = {
  name: 'remove parenthesised details',
  selector: /\([^)]*\)/u,
  fix: (toFix: string): string =>
    toFix
      .replace(/\([^)]*\)/gu, ' ')
      .replace(/\s{2,}/gu, ' ')
      .trim()
};

const PLURAL_STREET_TYPES: RegExp =
  /(?<![\p{L}\d])([Qq]uais|[Rr]ues|[Aa]venues|[Pp]laces|[Aa]llées|[Aa]llees|[Rr]outes|[Ii]mpasses|[Cc]hemins)(?![\p{L}\d])/gu;

/** Le référentiel ne connaît que le singulier : « 206 quais de Jemmapes » n'y existe pas. */
const SINGULARIZE_STREET_TYPE_IN_VOIE: CleanOperation = {
  name: 'singularize the street type',
  selector: PLURAL_STREET_TYPES,
  fix: (toFix: string): string => toFix.replace(PLURAL_STREET_TYPES, (type: string): string => type.slice(0, -1))
};

/**
 * Nettoyages réservés à l'interrogation du géocodeur, et volontairement absents de `CLEAN_VOIE` :
 * ils suppriment une information réelle — le second numéro d'une fourchette, le détail entre
 * parenthèses — qu'il serait fautif de retirer de l'adresse publiée. La question posée peut être
 * plus grossière que la réponse attendue, d'autant que la BAN rend elle-même l'adresse retenue.
 */
export const CLEAN_VOIE_FOR_SEARCH: CleanOperation[] = [
  KEEP_FIRST_NUMBER_OF_RANGE_IN_VOIE,
  REMOVE_PARENTHESES_IN_VOIE,
  SINGULARIZE_STREET_TYPE_IN_VOIE
];

export const CLEAN_VOIE: CleanOperation[] = [
  FIX_WRONG_ENCODING_IN_VOIE,
  REMOVE_MULTIPLE_SPACES_IN_VOIE,
  FIX_WRONG_SINGLE_QUOTE_IN_VOIE,
  FIX_INVALID_NUMERO_IN_VOIE,
  REMOVE_FORBIDDEN_CHARS_IN_VOIE,
  REMOVE_MULTILINES_IN_VOIE,
  REMOVE_NULL_PREFIX_IN_VOIE,
  REMOVE_ONLY_ZIPCODE_IN_VOIE,
  REMOVE_INCOMPLETE_ADDRESS_IN_VOIE,
  REMOVE_ZIPCODE_AND_FOLLOWING_TEXT_IN_VOIE,
  EXPAND_ABBREVIATIONS_IN_VOIE,
  JOIN_NUMBER_SUFFIX_IN_VOIE,
  REMOVE_HEADING_AND_TRAILING_SPACES_IN_VOIE
];

const isColonne = (colonneToTest: Partial<Colonne> & Partial<Jonction>): colonneToTest is Colonne =>
  colonneToTest.colonne != null;

export const voieField = (source: DataSource, voie: Jonction & Partial<Colonne>): string => {
  if (isColonne(voie)) return source[voie.colonne]?.toString() ?? '';
  const joined = voie.joindre.colonnes
    .map((colonne: string) => source[colonne])
    .filter(Boolean)
    .join(voie.joindre.séparateur);
  return joined || (voie.joindre.ou ? voieField(source, voie.joindre.ou) : '');
};
