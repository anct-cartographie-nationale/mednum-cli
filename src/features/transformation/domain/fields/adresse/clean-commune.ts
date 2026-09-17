import type { RegleDeNettoyage } from '@gouvfr-anct/lieux-de-mediation-numerique';

const FIX_FORGOTTEN_ARTICLE_FROM_PONTDECLAIX: RegleDeNettoyage = {
  nom: 'put forgotten le for Pont-de-Claix',
  selecteur: /^Pont-de-Claix$/,
  corriger: (aCorriger: string): string => aCorriger.toString().replace(/^Pont-de-Claix$/, 'Le-Pont-de-Claix')
};

const FIX_FORGOTTEN_ARTICLE_FROM_NOUVION_EN_THIERACHE: RegleDeNettoyage = {
  nom: 'le for NOUVION-EN-THIÉRACHE',
  selecteur: /^Nouvion-en-Thiérache$/,
  corriger: (aCorriger: string): string => aCorriger.toString().replace(/^Nouvion-en-Thiérache$/, 'Le-Nouvion-en-Thiérache')
};

const FIX_FORGOTTEN_ARTICLE_FROM_FAY_SAINT_QUENTIN: RegleDeNettoyage = {
  nom: 'put forgotten le for FAY-SAINT-QUENTIN',
  selecteur: /^Fay-Saint-Quentin$/,
  corriger: (aCorriger: string): string => aCorriger.toString().replace(/^Fay-Saint-Quentin$/, 'Le-Fay-Saint-Quentin')
};

const FIX_ADDED_LETTER_FROM_GRANDCHAMPS_DES_FONTAINES: RegleDeNettoyage = {
  nom: 'delete the letter s for Grandchamps-des-Fontaines',
  selecteur: /^Grandchamps-des-Fontaines$/,
  corriger: (aCorriger: string): string =>
    aCorriger.toString().replace(/^Grandchamps-des-Fontaines$/, 'Grandchamp-des-Fontaines')
};

const FIX_FORGOTTEN_ARTICLE_FROM_PRECHEUR: RegleDeNettoyage = {
  nom: 'put forgotten le for Prêcheur',
  selecteur: /^Prêcheur$/,
  corriger: (aCorriger: string): string => aCorriger.toString().replace(/^Prêcheur$/, 'Le-Prêcheur')
};

const FIX_SPELLING_NAME_OF_BORDERES_ET_LAMESENS: RegleDeNettoyage = {
  nom: 'fix typo in Bordères-et-Lamensen ',
  selecteur: /^Bordères-et-Lamensens$/,
  corriger: (aCorriger: string): string => aCorriger.toString().replace(/^Bordères-et-Lamensens$/, 'Bordères-et-Lamensans')
};

const FIX_SPELLING_NAME_OF_PIERREFFITTES_NESTALAS: RegleDeNettoyage = {
  nom: 'fix typo in Pierreffitte-Nestalas ',
  selecteur: /^Pierreffitte-Nestalas$/,
  corriger: (aCorriger: string): string => aCorriger.toString().replace(/^Pierreffitte-Nestalas$/, 'Pierrefitte-Nestalas')
};

const FIX_SPELLING_NAME_OF_AYRE_SUR_LA_LYS: RegleDeNettoyage = {
  nom: 'fix typo in Ayre-sur-la-Lys',
  selecteur: /^Ayre-sur-la-Lys$/,
  corriger: (aCorriger: string): string => aCorriger.toString().replace(/^Ayre-sur-la-Lys$/, 'Aire-sur-la-Lys')
};

const FIX_SPELLING_NAME_OF_SAUGNACQ_ET_MURET: RegleDeNettoyage = {
  nom: 'fix typo in Saugnacq-et-muret',
  selecteur: /^Saugnacq-et-muret$/,
  corriger: (aCorriger: string): string => aCorriger.toString().replace(/^Saugnacq-et-muret$/, 'Saugnac-et-muret')
};

const FIX_FORGOTTEN_DASH_OF_SAINT_PHILIBERT_DE_GRANDLIEU: RegleDeNettoyage = {
  nom: 'fix typo in Saint-Philbert-de-Grandlieu',
  selecteur: /^Saint-Philbert-de-Grandlieu$/,
  corriger: (aCorriger: string): string =>
    aCorriger.toString().replace(/^Saint-Philbert-de-Grandlieu$/, 'Saint-Philbert-de-Grand-Lieu')
};

const FIX_FORGOTTEN_APOSTROPHE_OF_SAINT_DONAT_SUR_LHERBASSE: RegleDeNettoyage = {
  nom: 'fix typo in Saint-Donat-sur-lHerbasse',
  selecteur: /^Saint-Donat-sur-lHerbasse$/,
  corriger: (aCorriger: string): string =>
    aCorriger.toString().replace(/^Saint-Donat-sur-lHerbasse$/, "Saint-Donat-sur-l'Herbasse")
};

const FIX_FORGOTTEN_LETTER_L_OF_LES_MOLETTES: RegleDeNettoyage = {
  nom: 'fix typo in Les-Molettes',
  selecteur: /^Les-Molettes$/,
  corriger: (aCorriger: string): string => aCorriger.toString().replace(/^Les-Molettes/, 'Les-Mollettes')
};

export const REGLES_COMMUNE_LOCALES: readonly RegleDeNettoyage[] = [
  FIX_FORGOTTEN_ARTICLE_FROM_PONTDECLAIX,
  FIX_FORGOTTEN_ARTICLE_FROM_NOUVION_EN_THIERACHE,
  FIX_FORGOTTEN_ARTICLE_FROM_FAY_SAINT_QUENTIN,
  FIX_ADDED_LETTER_FROM_GRANDCHAMPS_DES_FONTAINES,
  FIX_FORGOTTEN_ARTICLE_FROM_PRECHEUR,
  FIX_SPELLING_NAME_OF_BORDERES_ET_LAMESENS,
  FIX_SPELLING_NAME_OF_PIERREFFITTES_NESTALAS,
  FIX_SPELLING_NAME_OF_AYRE_SUR_LA_LYS,
  FIX_SPELLING_NAME_OF_SAUGNACQ_ET_MURET,
  FIX_FORGOTTEN_DASH_OF_SAINT_PHILIBERT_DE_GRANDLIEU,
  FIX_FORGOTTEN_APOSTROPHE_OF_SAINT_DONAT_SUR_LHERBASSE,
  FIX_FORGOTTEN_LETTER_L_OF_LES_MOLETTES
];

const communeFromVoie = (voie: string): string =>
  /\b\d{5}\b\s*,?\s*(?<commune>[\w\s\-éèêàâôûç-]+)/u.exec(voie)?.groups?.['commune'] ?? '';

export const communeField = (voie: string, commune?: string): string => commune?.toString() ?? communeFromVoie(voie);
