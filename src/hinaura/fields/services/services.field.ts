import { ModaliteAccompagnement, Service } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { HinauraLieuMediationNumerique } from '../../helper';

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

const processServices = (servicesToProcess?: string, modalitesAccompagnement: ModaliteAccompagnement[] = []): Service[] =>
  Array.from(SERVICES_MAP.keys()).reduce(
    (services: Service[], service: Service): Service[] =>
      canAppendService(service, modalitesAccompagnement, servicesToProcess, SERVICES_MAP.get(service)?.modalitesAccompagnement)
        ? [...services, service]
        : services,
    []
  );

export const formatServicesField = (
  hinauraLieuMediationNumerique: HinauraLieuMediationNumerique,
  modalitesAccompagnement: ModaliteAccompagnement[] = []
): Service[] =>
  Array.from(
    new Set([
      ...processServices(hinauraLieuMediationNumerique['À disposition'], modalitesAccompagnement),
      ...processServices(hinauraLieuMediationNumerique['Formations compétences de base proposées'], modalitesAccompagnement),
      ...processServices(
        hinauraLieuMediationNumerique['Comprendre et Utiliser les sites d’accès aux droits proposées'],
        modalitesAccompagnement
      ),
      ...processServices(hinauraLieuMediationNumerique['Sensibilisations culture numérique'], modalitesAccompagnement)
    ])
  );
