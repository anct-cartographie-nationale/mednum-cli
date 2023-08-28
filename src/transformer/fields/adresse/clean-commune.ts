import { CleanOperation } from './clean-operations';

const FIX_WRONG_ACCENT_CHARS: CleanOperation = {
  name: 'replace ╢ with Â',
  selector: /╢/u,
  fix: (toFix: string): string => toFix.replace('╢', 'Â')
};

const FIX_WRONG_APOSTROPHE: CleanOperation = {
  name: 'replace curved apostrophe with quote',
  selector: /’/u,
  fix: (toFix: string): string => toFix.replace('’', "'")
};

const REPLACE_HEADING_ST_WITH_SAINT: CleanOperation = {
  name: 'replace st with saint',
  selector: /^[Ss][Tt][-\s]/u,
  fix: (toFix: string): string => toFix.replace(/^[Ss][Tt][-\s]/gu, 'Saint-')
};

const REPLACE_HEADING_STE_WITH_SAINTE: CleanOperation = {
  name: 'replace st with saint',
  selector: /^[Ss][Tt][Ee][-\s]/u,
  fix: (toFix: string): string => toFix.replace(/^[Ss][Tt][Ee][-\s]/gu, 'Sainte-')
};

const REPLACE_ST_WITH_SAINT: CleanOperation = {
  name: 'replace st with saint',
  selector: /[-\s][Ss][Tt][-\s]/u,
  fix: (toFix: string): string => toFix.replace(/[-\s][Ss][Tt][-\s]/gu, '-Saint-')
};

const REPLACE_STE_WITH_SAINTE: CleanOperation = {
  name: 'replace st with saint',
  selector: /[-\s][Ss][Tt][Ee][-\s]/u,
  fix: (toFix: string): string => toFix.replace(/[-\s][Ss][Tt][Ee][-\s]/gu, '-Sainte-')
};

const REMOVE_TEXT_BETWEEN_PARENTHESIS: CleanOperation = {
  name: 'remove text between parenthesis',
  selector: /\([^)]+\)/u,
  fix: (toFix: string): string => toFix.trim()
};

const REMOVE_DISTRICT: CleanOperation = {
  name: 'remove district',
  selector: /\d+er?/u,
  fix: (toFix: string): string => toFix.replace(/\d+er?/u, '')
};

const REMOVE_CEDEX: CleanOperation = {
  name: 'remove cedex',
  selector: /[Cc](?:EDEX|edex)\s?\d+/u,
  fix: (toFix: string): string => toFix.replace(/[Cc](?:EDEX|edex)\s?\d+/u, '')
};

const REMOVE_NUMERIC_CHARS: CleanOperation = {
  name: 'remove numeric characters',
  selector: /\d+/gu,
  fix: (toFix: string): string => toFix.replace(/\d+/gu, '')
};

const REMOVE_SPACE_AFTER_QUOTE: CleanOperation = {
  name: 'remove space after quote',
  selector: /'\s+/u,
  fix: (toFix: string): string => toFix.replace(/'\s+/u, "'")
};

const REMOVE_HEADING_AND_TRAILING_SPACES: CleanOperation = {
  name: 'remove heading and trailing spaces',
  selector: /^\s+|\s+$/u,
  fix: (toFix: string): string => toFix.trim()
};

const REPLACE_SPACES_WITH_DASHES: CleanOperation = {
  name: 'replace spaces with dashed',
  selector: /\s/u,
  fix: (toFix: string): string => toFix.replace(/\s/gu, '-')
};

const FIX_UNEXPECTED_DETAILS: CleanOperation = {
  name: 'unexpected details in commune',
  selector: /\s*\(.*\)\s*/u,
  fix: (toFix: number | string): string => toFix.toString().replace(/\s*\(.*\)\s*/u, '')
};

export const CLEAN_COMMUNE: CleanOperation[] = [
  FIX_UNEXPECTED_DETAILS,
  FIX_WRONG_ACCENT_CHARS,
  FIX_WRONG_APOSTROPHE,
  REPLACE_HEADING_ST_WITH_SAINT,
  REPLACE_HEADING_STE_WITH_SAINTE,
  REPLACE_ST_WITH_SAINT,
  REPLACE_STE_WITH_SAINTE,
  REMOVE_TEXT_BETWEEN_PARENTHESIS,
  REMOVE_DISTRICT,
  REMOVE_CEDEX,
  REMOVE_NUMERIC_CHARS,
  REMOVE_SPACE_AFTER_QUOTE,
  REMOVE_HEADING_AND_TRAILING_SPACES,
  REPLACE_SPACES_WITH_DASHES
];

const communeFromVoie = (voie: string): string =>
  /\b\d{5}\b\s*,?\s*(?<commune>[\w\s\-éèêàâôûç-]+)/u.exec(voie)?.groups?.['commune'] ?? '';

export const communeField = (voie: string, commune?: string): string => commune?.toString() ?? communeFromVoie(voie);
