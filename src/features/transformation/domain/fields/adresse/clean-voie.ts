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

const PARENTHESISED_DETAIL: RegExp =
  /\((?=[^)]*(?:\d|rdc|porte|[ée]tage|b[âa]t|imm|r[ée]sidence|escalier|hall|entr[ée]e|niveau|appt?|apt))[^)]*\)/giu;

/**
 * Ce qu'une parenthèse porte relève tantôt du complément d'adresse — un étage, une porte, un
 * bâtiment — tantôt de la commune déléguée, « 27 Rue Victor Hugo (Saint-Pol-sur-Mer) », dont le
 * référentiel a besoin pour lever l'ambiguïté. On ne retire donc que les premières, reconnues
 * à un chiffre ou à un mot de bâtiment.
 */
const REMOVE_PARENTHESISED_DETAIL_IN_VOIE: CleanOperation = {
  name: 'remove parenthesised building details, never a delegated commune',
  selector: /\((?=[^)]*(?:\d|[Rr][Dd][Cc]|[Pp]orte|[ÉEée]tage|[Bb][ÂAâa]t|[Ii]mm|[Rr][ée]sidence))[^)]*\)/u,
  fix: (toFix: string): string =>
    toFix
      .replace(PARENTHESISED_DETAIL, ' ')
      .replace(/\s{2,}/gu, ' ')
      .trim()
};

/** Les types de voie que connaît le référentiel. Sert à repérer où commence l'adresse. */
const STREET_TYPES =
  'rue|avenue|boulevard|place|chemin|route|impasse|all[ée]e|quai|cours|square|passage|sentier|voie|faubourg|esplanade|promenade|villa|cit[ée]|hameau|lotissement|mail|rond[- ]point|traverse|venelle|clos|domaine|parvis';

const POSTAL_BOX: RegExp = /(?<![\p{L}\d])(BP|B\.P\.|CS|CEDEX|C[ÉE]DEX)\s*\d*(?![\p{L}\d])/giu;

/** Une boîte postale n'est pas un point sur une carte, et la BAN n'en connaît aucune. */
const REMOVE_POSTAL_BOX_IN_VOIE: CleanOperation = {
  name: 'remove a postal box or cedex mention',
  selector: /(?<![\p{L}\d])([Bb][Pp]|[Cc][Ss]|[Cc][ÉEée][Dd][Ee][Xx])(?![\p{L}\d])/u,
  fix: (toFix: string): string =>
    toFix
      .replace(POSTAL_BOX, ' ')
      .replace(/\s{2,}/gu, ' ')
      .trim()
};

const BUILDING_DETAIL: RegExp =
  /(?<![\p{L}\d])(b[âa]t(?:iment)?|imm(?:euble)?|r[ée]sidence|[ée]tage|rdc|appt?|apt|escalier|hall|entr[ée]e|niveau)(?![\p{L}\d])/iu;
const DETERMINER_BEFORE: RegExp = /(?:de|du|des|d'|d’|la|le|les|l'|l’|au|aux|en)\s*$/iu;
const ANY_STREET_TYPE: RegExp = new RegExp(`(?:${STREET_TYPES})(?![\\p{L}\\d])`, 'iu');

/**
 * Bâtiment, étage, porte : ce qui suit l'adresse ne l'affine pas pour la BAN, il la brouille.
 * On ne tronque qu'à trois conditions, apprises des cas où la troncature faisait chuter le
 * score : une vraie adresse doit précéder, elle doit contenir un type de voie, et le mot ne
 * doit pas suivre un déterminant — « Impasse du Moulin de l'Escalier » nomme un escalier.
 */
const REMOVE_BUILDING_DETAIL_IN_VOIE: CleanOperation = {
  name: 'remove building, floor or door details',
  selector: BUILDING_DETAIL,
  fix: (toFix: string): string => {
    const found: RegExpExecArray | null = BUILDING_DETAIL.exec(toFix);
    if (found == null) return toFix;
    const before: string = toFix.slice(0, found.index).trim();

    return before.split(/\s+/u).length < 3 || !ANY_STREET_TYPE.test(before) || DETERMINER_BEFORE.test(before) ? toFix : before;
  }
};

const ADDRESS_FROM_STREET_TYPE: RegExp = new RegExp(
  `^([^\\d]*?)((?:\\d+\\s*(?:bis|ter|quater)?\\s*)?(?:${STREET_TYPES})(?![\\p{L}\\d])\\s+\\S+\\s+\\S+.*)$`,
  'iu'
);
const COMPOUND_NAME_START: RegExp =
  /^(?:grande?|petite?|vieille|vieux|haute?|basse?|belle?|beau|nouvelle?|nouveau|longue?|premi[èe]re?|derni[èe]re?|hlm)$/iu;

/**
 * Le nom de l'établissement précède souvent son adresse — « IMMEUBLE ANTHYLLIS ZAC BASSO CAMBO
 * 8 RUE PAUL MESPLE ». On repart du type de voie, sauf quand celui-ci appartient au nom : un
 * trait d'union collé le trahit (« Grand-Place »), un adjectif qui le précède aussi
 * (« Grande Rue »).
 */
const KEEP_ADDRESS_FROM_STREET_TYPE_IN_VOIE: CleanOperation = {
  name: 'drop what precedes the street type',
  selector: ADDRESS_FROM_STREET_TYPE,
  fix: (toFix: string): string => {
    const found: RegExpExecArray | null = ADDRESS_FROM_STREET_TYPE.exec(toFix);
    if (found?.[1] == null || found[2] == null || found[1].trim() === '') return toFix;
    if (/\S-$/u.test(found[1])) return toFix;
    const lastWord: string = found[1].trim().replace(/-+$/u, '').split(/\s+/u).pop() ?? '';

    return COMPOUND_NAME_START.test(lastWord) ? toFix : found[2];
  }
};

const LETTER_BETWEEN_NUMBER_AND_TYPE: RegExp = new RegExp(
  `^(\\s*\\d+)\\s+[a-z]\\s+(?=(?:${STREET_TYPES})(?![\\p{L}\\d]))`,
  'iu'
);

/**
 * « 46 b Avenue Joliot Curie » : la lettre isolée est un suffixe de numéro que le référentiel
 * ignore. On ne la retire que devant un type de voie, faute de quoi on amputerait un « 372 R
 * des Tovets » où le R abrège la rue elle-même.
 */
const REMOVE_LETTER_BETWEEN_NUMBER_AND_TYPE_IN_VOIE: CleanOperation = {
  name: 'remove an isolated letter between the number and the street type',
  selector: /^\s*\d+\s+[A-Za-z]\s+\p{L}/u,
  fix: (toFix: string): string => toFix.replace(LETTER_BETWEEN_NUMBER_AND_TYPE, '$1 ')
};

/**
 * Nettoyages réservés à l'interrogation du géocodeur, et volontairement absents de `CLEAN_VOIE` :
 * ils suppriment une information réelle — le second numéro d'une fourchette, le détail entre
 * parenthèses — qu'il serait fautif de retirer de l'adresse publiée. La question posée peut être
 * plus grossière que la réponse attendue, d'autant que la BAN rend elle-même l'adresse retenue.
 */
export const CLEAN_VOIE_FOR_SEARCH: CleanOperation[] = [
  KEEP_FIRST_NUMBER_OF_RANGE_IN_VOIE,
  REMOVE_PARENTHESISED_DETAIL_IN_VOIE,
  REMOVE_POSTAL_BOX_IN_VOIE,
  REMOVE_BUILDING_DETAIL_IN_VOIE,
  KEEP_ADDRESS_FROM_STREET_TYPE_IN_VOIE,
  REMOVE_LETTER_BETWEEN_NUMBER_AND_TYPE_IN_VOIE
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
