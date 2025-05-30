import { CleanOperation } from './clean-operations';

const FIX_WRONG_ACCENT_CHARS: CleanOperation = {
  name: 'replace ╢ with Â',
  selector: /╢/,
  fix: (toFix: string): string => toFix.replace('╢', 'Â')
};

const FIX_WRONG_APOSTROPHE: CleanOperation = {
  name: 'replace curved apostrophe with quote',
  selector: /’/,
  fix: (toFix: string): string => toFix.replace('’', "'")
};

const REPLACE_HEADING_ST_WITH_SAINT: CleanOperation = {
  name: 'replace st with saint',
  selector: /^[Ss][Tt][-\s]/,
  fix: (toFix: string): string => toFix.replace(/^[Ss][Tt][-\s]/g, 'Saint-')
};

const REPLACE_HEADING_STE_WITH_SAINTE: CleanOperation = {
  name: 'replace st with saint',
  selector: /^[Ss][Tt][Ee][-\s]/,
  fix: (toFix: string): string => toFix.replace(/^[Ss][Tt][Ee][-\s]/g, 'Sainte-')
};

const REPLACE_ST_WITH_SAINT: CleanOperation = {
  name: 'replace st with saint',
  selector: /[-\s][Ss][Tt][-\s]/,
  fix: (toFix: string): string => toFix.replace(/[-\s][Ss][Tt][-\s]/g, '-Saint-')
};

const REPLACE_STE_WITH_SAINTE: CleanOperation = {
  name: 'replace st with saint',
  selector: /[-\s][Ss][Tt][Ee][-\s]/,
  fix: (toFix: string): string => toFix.replace(/[-\s][Ss][Tt][Ee][-\s]/g, '-Sainte-')
};

const REMOVE_TEXT_BETWEEN_PARENTHESIS: CleanOperation = {
  name: 'remove text between parenthesis',
  selector: /\([^)]+\)/,
  fix: (toFix: string): string => toFix.trim()
};

const REMOVE_DISTRICT: CleanOperation = {
  name: 'remove district',
  selector: /\d+er?/,
  fix: (toFix: string): string => toFix.replace(/\d+er?/, '')
};

const REMOVE_CEDEX: CleanOperation = {
  name: 'remove cedex',
  selector: /-?[Cc](?:[ÉE]DEX|[ée]dex)\s?\d*/,
  fix: (toFix: string): string => toFix.replace(/-?[Cc](?:[ÉE]DEX|[ée]dex)\s?\d*/, '')
};

const REMOVE_NUMERIC_CHARS: CleanOperation = {
  name: 'remove numeric characters',
  selector: /\d+/g,
  fix: (toFix: string): string => toFix.replace(/\d+/g, '')
};

const REMOVE_SPACE_AFTER_QUOTE: CleanOperation = {
  name: 'remove space after quote',
  selector: /'\s+/,
  fix: (toFix: string): string => toFix.replace(/'\s+/, "'")
};

const REMOVE_HEADING_AND_TRAILING_SPACES: CleanOperation = {
  name: 'remove heading and trailing spaces',
  selector: /^\s+|\s+$/,
  fix: (toFix: string): string => toFix.trim()
};

const REPLACE_SPACES_WITH_DASHES: CleanOperation = {
  name: 'replace spaces with dashed',
  selector: /\s/,
  fix: (toFix: string): string => toFix.replace(/\s/g, '-')
};

const FIX_UNEXPECTED_DETAILS: CleanOperation = {
  name: 'unexpected details in commune',
  selector: /\s*\(.*\)\s*/,
  fix: (toFix: number | string): string => toFix.toString().replace(/\s*\(.*\)\s*/, '')
};

const FIX_FORGOTTEN_ARTICLE_FROM_PONTDECLAIX: CleanOperation = {
  name: 'put forgotten le for Pont-de-Claix',
  selector: /^Pont-de-Claix$/,
  fix: (toFix: string): string => toFix.toString().replace(/^Pont-de-Claix$/, 'Le Pont-de-Claix')
};

const FIX_FORGOTTEN_ARTICLE_FROM_NOUVION_EN_THIERACHE: CleanOperation = {
  name: 'le for NOUVION-EN-THIÉRACHE',
  selector: /^Nouvion-en-Thiérache$/,
  fix: (toFix: string): string => toFix.toString().replace(/^Nouvion-en-Thiérache$/, 'Le Nouvion-en-Thiérache')
};

const FIX_FORGOTTEN_ARTICLE_FROM_FAY_SAINT_QUENTIN: CleanOperation = {
  name: 'put forgotten le for FAY-SAINT-QUENTIN',
  selector: /^Fay-Saint-Quentin$/,
  fix: (toFix: string): string => toFix.toString().replace(/^Fay-Saint-Quentin$/, 'Le Fay-Saint-Quentin')
};

const FIX_ADDED_LETTER_FROM_GRANDCHAMPS_DES_FONTAINES: CleanOperation = {
  name: 'delete the letter s for Grandchamps-des-Fontaines',
  selector: /^Grandchamps-des-Fontaines$/,
  fix: (toFix: string): string => toFix.toString().replace(/^Grandchamps-des-Fontaines$/, 'Grandchamp-des-Fontaines')
};

const FIX_FORGOTTEN_ARTICLE_FROM_PRECHEUR: CleanOperation = {
  name: 'put forgotten le for Prêcheur',
  selector: /^Prêcheur$/,
  fix: (toFix: string): string => toFix.toString().replace(/^Prêcheur$/, 'Le Prêcheur')
};

const FIX_SPELLING_NAME_OF_BORDERES_ET_LAMESENS: CleanOperation = {
  name: 'fix typo in Bordères-et-Lamensen ',
  selector: /^Bordères-et-Lamensens$/,
  fix: (toFix: string): string => toFix.toString().replace(/^Bordères-et-Lamensens$/, 'Bordères-et-Lamensans')
};

const FIX_SPELLING_NAME_OF_PIERREFFITTES_NESTALAS: CleanOperation = {
  name: 'fix typo in Pierreffitte-Nestalas ',
  selector: /^Pierreffitte-Nestalas$/,
  fix: (toFix: string): string => toFix.toString().replace(/^Pierreffitte-Nestalas$/, 'Pierrefitte-Nestalas')
};

const FIX_SPELLING_NAME_OF_AYRE_SUR_LA_LYS: CleanOperation = {
  name: 'fix typo in Ayre-sur-la-Lys',
  selector: /^Ayre-sur-la-Lys$/,
  fix: (toFix: string): string => toFix.toString().replace(/^Ayre-sur-la-Lys$/, 'Aire-sur-la-Lys')
};

const FIX_SPELLING_NAME_OF_SAUGNACQ_ET_MURET: CleanOperation = {
  name: 'fix typo in Saugnacq-et-muret',
  selector: /^Saugnacq-et-muret$/,
  fix: (toFix: string): string => toFix.toString().replace(/^Saugnacq-et-muret$/, 'Saugnac-et-muret')
};
const FIX_FORGOTTEN_DASH_OF_SAINT_PHILIBERT_DE_GRANDLIEU: CleanOperation = {
  name: 'fix typo in Saint-Philbert-de-Grandlieu',
  selector: /^Saint-Philbert-de-Grandlieu$/,
  fix: (toFix: string): string => toFix.toString().replace(/^Saint-Philbert-de-Grandlieu$/, 'Saint-Philbert-de-Grand-Lieu')
};

const FIX_FORGOTTEN_APOSTROPHE_OF_SAINT_DONAT_SUR_LHERBASSE: CleanOperation = {
  name: 'fix typo in Saint-Donat-sur-lHerbasse',
  selector: /^Saint-Donat-sur-lHerbasse$/,
  fix: (toFix: string): string => toFix.toString().replace(/^Saint-Donat-sur-lHerbasse$/, "Saint-Donat-sur-l'Herbasse")
};

const FIX_FORGOTTEN_LETTER_L_OF_LES_MOLETTES: CleanOperation = {
  name: 'fix typo in Les-Molettes',
  selector: /^Les-Molettes$/,
  fix: (toFix: string): string => toFix.toString().replace(/^Les-Molettes/, 'Les-Mollettes')
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
  FIX_FORGOTTEN_ARTICLE_FROM_PONTDECLAIX,
  FIX_FORGOTTEN_ARTICLE_FROM_NOUVION_EN_THIERACHE,
  FIX_FORGOTTEN_ARTICLE_FROM_FAY_SAINT_QUENTIN,
  FIX_ADDED_LETTER_FROM_GRANDCHAMPS_DES_FONTAINES,
  FIX_FORGOTTEN_ARTICLE_FROM_PRECHEUR,
  FIX_SPELLING_NAME_OF_BORDERES_ET_LAMESENS,
  FIX_SPELLING_NAME_OF_PIERREFFITTES_NESTALAS,
  REPLACE_SPACES_WITH_DASHES,
  FIX_SPELLING_NAME_OF_AYRE_SUR_LA_LYS,
  FIX_SPELLING_NAME_OF_SAUGNACQ_ET_MURET,
  FIX_FORGOTTEN_DASH_OF_SAINT_PHILIBERT_DE_GRANDLIEU,
  FIX_FORGOTTEN_APOSTROPHE_OF_SAINT_DONAT_SUR_LHERBASSE,
  FIX_FORGOTTEN_LETTER_L_OF_LES_MOLETTES
];

const communeFromVoie = (voie: string): string =>
  /\b\d{5}\b\s*,?\s*(?<commune>[\w\s\-éèêàâôûç-]+)/u.exec(voie)?.groups?.['commune'] ?? '';

export const communeField = (voie: string, commune?: string): string => commune?.toString() ?? communeFromVoie(voie);
