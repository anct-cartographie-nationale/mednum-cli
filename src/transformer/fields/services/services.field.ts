import { ModaliteAccompagnement, ModalitesAccompagnement, Service, Services } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Choice, LieuxMediationNumeriqueMatching, DataSource, cibleAsDefault } from '../../input';
import { processModalitesAccompagnement } from '../modalites-accompagnement/modalites-accompagnement.field';

const isAllowedTerm = (choice: Choice<Service>, sourceValue: string): boolean =>
  choice.sauf?.every((forbidden: string): boolean => !sourceValue.includes(forbidden)) ?? true;

const isMatchingModaliteAccompagnement = (
  choice: Choice<Service> & { modalitesAccompagnement?: ModaliteAccompagnement },
  modalitesAccompagnement: ModalitesAccompagnement
): boolean =>
  choice.modalitesAccompagnement == null ? true : modalitesAccompagnement.includes(choice.modalitesAccompagnement);

const isTermFound =
  (
    choice: Choice<Service> & { modalitesAccompagnement?: ModaliteAccompagnement },
    modalitesAccompagnement: ModalitesAccompagnement,
    sourceValue: string
  ) =>
  (found: boolean, term: string): boolean =>
    found ||
    (sourceValue.includes(term.toLowerCase()) &&
      isAllowedTerm(choice, sourceValue) &&
      isMatchingModaliteAccompagnement(choice, modalitesAccompagnement));

const containsOneOfTheTerms = (
  choice: Choice<Service>,
  modalitesAccompagnement: ModalitesAccompagnement,
  sourceValue: string = ''
): boolean =>
  choice.termes == null
    ? sourceValue !== ''
    : choice.termes.reduce(isTermFound(choice, modalitesAccompagnement, sourceValue.toLowerCase()), false);

const appendService = (services: Service[], service?: Service): Service[] => [
  ...services,
  ...(service == null ? [] : [service])
];

const isDefault = (choice: Choice<Service>): boolean => choice.colonnes == null;

const findAndAppendServices =
  (choice: Choice<Service>, source: DataSource, modalitesAccompagnement: ModalitesAccompagnement) =>
  (services: Service[], colonne: string): Service[] =>
    containsOneOfTheTerms(choice, modalitesAccompagnement, source[colonne]?.toString())
      ? appendService(services, choice.cible)
      : services;

const servicesForTerms =
  (choice: Choice<Service>, source: DataSource, modalitesAccompagnement: ModalitesAccompagnement) =>
  (services: Service[], colonne: string): Service[] =>
    isDefault(choice)
      ? appendService(services, choice.cible)
      : findAndAppendServices(choice, source, modalitesAccompagnement)(services, colonne);

const appendServices =
  (source: DataSource, modalitesAccompagnement: ModalitesAccompagnement) =>
  (services: Service[], choice: Choice<Service>): Service[] => [
    ...services,
    ...(choice.colonnes ?? cibleAsDefault(choice)).reduce(servicesForTerms(choice, source, modalitesAccompagnement), [])
  ];

export const processServices = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Services =>
  Services(
    Array.from(new Set(matching.services?.reduce(appendServices(source, processModalitesAccompagnement(source, matching)), [])))
  );
