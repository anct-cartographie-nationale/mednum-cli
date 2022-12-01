import { ModaliteAccompagnement, Service } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LesAssembleursLieuMediationNumerique } from '../../helpers';
import { SERVICES_MAP } from './services.map';

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
  lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique,
  modalitesAccompagnement: ModaliteAccompagnement[] = []
): Service[] =>
  Array.from(
    new Set([
      ...processServices(lesAssembleursLieuMediationNumerique['Type démarches'], modalitesAccompagnement),
      ...processServices(lesAssembleursLieuMediationNumerique['Type médiation numérique'], modalitesAccompagnement)
    ])
  );
