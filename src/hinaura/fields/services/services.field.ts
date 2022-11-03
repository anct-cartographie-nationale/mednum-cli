import { ModaliteAccompagnement, Service, Services } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { HinauraLieuMediationNumerique } from '../../helper';
import { processModalitesAccompagnement } from '../modalites-accompagnement/modalites-accompagnement.field';

const SERVICES_MAP: Map<Service, { keywords: string[]; modalitesAccompagnement?: ModaliteAccompagnement }> = new Map([
  [Service.AccederAUneConnexionInternet, { keywords: ['réseau wifi'] }],
  [Service.AccederADuMateriel, { keywords: ['accès libre à du matériel informatique'] }],
  [Service.PrendreEnMainUnOrdinateur, { keywords: ["découvrir l'ordinateur"] }],
  [Service.UtiliserLeNumerique, { keywords: ["découvrir l'ordinateur", 'cultures numériques'] }],
  [Service.ApprofondirMaCultureNumerique, { keywords: ["découvrir l'ordinateur", 'cultures numériques'] }],
  [Service.PrendreEnMainUnSmartphoneOuUneTablette, { keywords: ['tablette', 'smartphone'] }],
  [Service.PromouvoirLaCitoyenneteNumerique, { keywords: ['cultures numériques'] }],
  [Service.AccompagnerLesDemarchesDeSante, { keywords: ['cpam', 'ameli.fr'] }],
  [
    Service.DevenirAutonomeDansLesDemarchesAdministratives,
    {
      keywords: ['services de la caf', 'services des impôts', 'logement social', 'pôle emploi', 'pole-emploi.fr'],
      modalitesAccompagnement: ModaliteAccompagnement.Seul
    }
  ],
  [
    Service.RealiserDesDemarchesAdministratives,
    {
      keywords: ['services de la caf', 'services des impôts', 'logement social', 'pôle emploi', 'pole-emploi.fr'],
      modalitesAccompagnement: ModaliteAccompagnement.AvecDeLAide
    }
  ]
]);

const servicesToProcessIncludesOnOfTheKeywords = (servicesToProcess: string, service: Service): boolean =>
  (SERVICES_MAP.get(service) ?? { keywords: [] }).keywords.reduce(
    (alreadyIncluded: boolean, keyword: string): boolean =>
      alreadyIncluded || servicesToProcess.toLocaleLowerCase().includes(keyword),
    false
  );

const canAppendService = (
  service: Service,
  modalitesAccompagnement: ModaliteAccompagnement[],
  servicesToProcess?: string,
  expectedModalite?: ModaliteAccompagnement
): boolean =>
  servicesToProcess != null &&
  (expectedModalite == null || modalitesAccompagnement.includes(expectedModalite)) &&
  servicesToProcessIncludesOnOfTheKeywords(servicesToProcess, service);

const extractServicesFrom = (servicesToProcess?: string, modalitesAccompagnement: ModaliteAccompagnement[] = []): Service[] =>
  Array.from(SERVICES_MAP.keys()).reduce(
    (services: Service[], service: Service): Service[] =>
      canAppendService(service, modalitesAccompagnement, servicesToProcess, SERVICES_MAP.get(service)?.modalitesAccompagnement)
        ? [...services, service]
        : services,
    []
  );

const useModalitesAccompagnementToGetServices = (
  hinauraLieuMediationNumerique: HinauraLieuMediationNumerique,
  modalitesAccompagnement: ModaliteAccompagnement[]
): Services =>
  Services(
    Array.from(
      new Set([
        ...extractServicesFrom(hinauraLieuMediationNumerique['À disposition'], modalitesAccompagnement),
        ...extractServicesFrom(
          hinauraLieuMediationNumerique['Formations compétences de base proposées'],
          modalitesAccompagnement
        ),
        ...extractServicesFrom(
          hinauraLieuMediationNumerique['Comprendre et Utiliser les sites d’accès aux droits proposées'],
          modalitesAccompagnement
        ),
        ...extractServicesFrom(hinauraLieuMediationNumerique['Sensibilisations culture numérique'], modalitesAccompagnement)
      ])
    )
  );

export const processServices = (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique): Services =>
  useModalitesAccompagnementToGetServices(
    hinauraLieuMediationNumerique,
    processModalitesAccompagnement(hinauraLieuMediationNumerique)
  );
