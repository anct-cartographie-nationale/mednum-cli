import { ModaliteAccompagnement, Service } from '@gouvfr-anct/lieux-de-mediation-numerique';

const servicesToProcessIncludesOnOfTheKeywords = (
  SERVICES_MAP: Map<Service, { keywords: string[]; modalitesAccompagnement?: ModaliteAccompagnement | undefined }>,
  servicesToProcess: string,
  service: Service
): boolean =>
  (SERVICES_MAP.get(service) ?? { keywords: [] }).keywords.reduce(
    (alreadyIncluded: boolean, keyword: string): boolean =>
      alreadyIncluded || servicesToProcess.toLocaleLowerCase().includes(keyword),
    false
  );

const canAppendService = (
  SERVICES_MAP: Map<Service, { keywords: string[]; modalitesAccompagnement?: ModaliteAccompagnement | undefined }>,
  service: Service,
  modalitesAccompagnement: ModaliteAccompagnement[],
  servicesToProcess?: string,
  expectedModalite?: ModaliteAccompagnement
): boolean =>
  servicesToProcess != null &&
  (expectedModalite == null || modalitesAccompagnement.includes(expectedModalite)) &&
  servicesToProcessIncludesOnOfTheKeywords(SERVICES_MAP, servicesToProcess, service);

export const processServices = (
  SERVICES_MAP: Map<Service, { keywords: string[]; modalitesAccompagnement?: ModaliteAccompagnement | undefined }>,
  servicesToProcess?: string,
  modalitesAccompagnement: ModaliteAccompagnement[] = []
): Service[] =>
  Array.from(SERVICES_MAP.keys()).reduce(
    (services: Service[], service: Service): Service[] =>
      canAppendService(
        SERVICES_MAP,
        service,
        modalitesAccompagnement,
        servicesToProcess,
        SERVICES_MAP.get(service)?.modalitesAccompagnement
      )
        ? [...services, service]
        : services,
    []
  );

// export const formatServicesField = (
//   lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique,
//   modalitesAccompagnement: ModaliteAccompagnement[] = []
// ): Service[] =>
//   Array.from(
//     new Set([
//       ...processServices(lesAssembleursLieuMediationNumerique['Type démarches'], modalitesAccompagnement),
//       ...processServices(lesAssembleursLieuMediationNumerique['Type médiation numérique'], modalitesAccompagnement)
//     ])
//   );
