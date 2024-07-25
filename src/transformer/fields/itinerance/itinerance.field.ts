import { Itinerance, Itinerances } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Choice, LieuxMediationNumeriqueMatching, DataSource } from '../../input';

const isAllowedTerm = (choice: Choice<Itinerance>, sourceValue: string): boolean =>
  choice.sauf?.every((forbidden: string): boolean => !sourceValue.includes(forbidden)) ?? true;

const isTermFound =
  (sourceValue: string, choice: Choice<Itinerance>) =>
  (found: boolean, term: string): boolean =>
    found || (sourceValue.includes(term.toLowerCase()) && isAllowedTerm(choice, sourceValue));

const containsOneOfTheTerms = (choice: Choice<Itinerance>, sourceValue: string = ''): boolean =>
  choice.termes == null ? sourceValue !== '' : choice.termes.reduce(isTermFound(sourceValue.toLowerCase(), choice), false);

const appendItinerance = (itinerances: Itinerance[], itinerance?: Itinerance): Itinerance[] => [
  ...itinerances,
  ...(itinerance == null ? [] : [itinerance])
];

const itinerancesForTerms =
  (choice: Choice<Itinerance>, source: DataSource) =>
  (itinerances: Itinerance[], colonne: string): Itinerance[] =>
    containsOneOfTheTerms(choice, source[colonne]?.toString()) ? appendItinerance(itinerances, choice.cible) : itinerances;

const appendItinerances =
  (source: DataSource) =>
  (itinerances: Itinerance[], choice: Choice<Itinerance>): Itinerance[] => [
    ...itinerances,
    ...(choice.colonnes ?? []).reduce(itinerancesForTerms(choice, source), [])
  ];

export const processItinerances = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Itinerances =>
  Itinerances(Array.from(new Set(matching.itinerance?.reduce(appendItinerances(source), []))));
