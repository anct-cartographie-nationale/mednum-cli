import { Colonne, DataSource, Jonction } from '../../input';
import { CleanOperation } from './clean-operations';

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

const REMOVE_INCOMPLETE_ADDRESS_IN_VOIE: CleanOperation = {
  name: 'remove incomplete address in voie',
  selector:
    /^(C\/O A\.THEVENIER LAFARGE73 AVENUE DU MONT BLANCBAT B|Rue|.*(Grande?.Rue|GRANDE?.RUE)|1 - 3|Residence les 3 C|null null|-)$/,
  fix: (): string => ''
};

const REMOVE_ZIPCODE_AND_FOLLOWING_TEXT_IN_VOIE: CleanOperation = {
  name: 'remove zipcode and following text in voie',
  selector: /^(?<voie>.*?)\s\d{5}\s\w+/u,
  fix: (toFix: string): string => /^(?<voie>.*?)\s\d{5}\s\w+/u.exec(toFix)?.groups?.['voie'] ?? toFix
};

const REMOVE_HEADING_AND_TRAILING_SPACES_IN_VOIE: CleanOperation = {
  name: 'remove heading and trailing spaces',
  selector: /^\s+|\s+$/u,
  fix: (toFix: string): string => toFix.trim()
};

export const CLEAN_VOIE: CleanOperation[] = [
  REMOVE_MULTIPLE_SPACES_IN_VOIE,
  FIX_WRONG_SINGLE_QUOTE_IN_VOIE,
  FIX_INVALID_NUMERO_IN_VOIE,
  REMOVE_FORBIDDEN_CHARS_IN_VOIE,
  REMOVE_MULTILINES_IN_VOIE,
  REMOVE_INCOMPLETE_ADDRESS_IN_VOIE,
  REMOVE_ZIPCODE_AND_FOLLOWING_TEXT_IN_VOIE,
  REMOVE_HEADING_AND_TRAILING_SPACES_IN_VOIE
];

const isColonne = (colonneToTest: Partial<Colonne> & Partial<Jonction>): colonneToTest is Colonne =>
  colonneToTest.colonne != null;

export const voieField = (source: DataSource, voie: Jonction & Partial<Colonne>): string =>
  isColonne(voie)
    ? (source[voie.colonne]?.toString() ?? '')
    : voie.joindre.colonnes
        .reduce((voiePart: string, colonne: string): string => [voiePart, source[colonne]].join(voie.joindre.séparateur), '')
        .trim();
