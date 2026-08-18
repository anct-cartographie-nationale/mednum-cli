import { OsmOpeningHoursString } from './process-horaires.field';

const stripAccents = (text: string): string => text.normalize('NFD').replace(/[\u0300-\u036f]/gu, '');

const OCCURRENCE_IN_MONTH_SELECTOR =
  /(?<ordinal>1ers?|premiers?|2e?mes?|deuxiemes?|seconds?|3e?mes?|troisiemes?|4e?mes?|quatriemes?|derniere?s?)\s+(?<day>lundis?|mardis?|mercredis?|jeudis?|vendredis?|samedis?|dimanches?)\s+du\s+mois/giu;

const ORDINAL_DISPLAY: Record<string, string> = {
  '1er': '1er',
  premier: '1er',
  '2eme': '2ème',
  deuxieme: '2ème',
  second: '2ème',
  '3eme': '3ème',
  troisieme: '3ème',
  '4eme': '4ème',
  quatrieme: '4ème',
  dernier: 'dernier'
};

const singularize = (word: string): string => (word.endsWith('s') ? word.slice(0, -1) : word);

const toDisplayOrdinal = (ordinal: string): string =>
  ORDINAL_DISPLAY[singularize(stripAccents(ordinal).replace(/\s/gu, '')).toLowerCase()] ?? ordinal;

const capitalize = (text: string): string => `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

const toOccurrenceComment = (match: RegExpMatchArray): string =>
  `${capitalize(toDisplayOrdinal(match.groups?.['ordinal'] ?? ''))} ${singularize(match.groups?.['day'] ?? '')} du mois`;

export const extractHorairesOccurrenceComments = (horairesField?: string): string[] =>
  horairesField == null
    ? []
    : [...new Set([...stripAccents(horairesField).matchAll(OCCURRENCE_IN_MONTH_SELECTOR)].map(toOccurrenceComment))];

export const appendHorairesOccurrenceComments = (
  osmOpeningHours: OsmOpeningHoursString,
  comments: string[]
): OsmOpeningHoursString =>
  osmOpeningHours == null || comments.length === 0 ? osmOpeningHours : `${osmOpeningHours} "${comments.join('; ')}"`;
