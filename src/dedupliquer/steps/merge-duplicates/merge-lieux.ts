import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';

const mergeArrayStrings = (arrayString1: string, arrayString2: string): string =>
  Array.from(new Set([...arrayString1.split('|'), ...arrayString2.split('|')]))
    .filter(Boolean)
    .join('|');

const mergeServices = (services1?: string, services2?: string): { services?: string } =>
  services1 == null || services2 == null ? {} : { services: mergeArrayStrings(services1, services2) };

const mergeModalitesAccompagnement = (
  modalitesAccompagnement1?: string,
  modalitesAccompagnement2?: string
): { modalites_accompagnement?: string } =>
  modalitesAccompagnement1 == null || modalitesAccompagnement2 == null
    ? {}
    : { modalites_accompagnement: mergeArrayStrings(modalitesAccompagnement1, modalitesAccompagnement2) };

const mergeFraisACharge = (fraisACharge1?: string, fraisACharge2?: string): { frais_a_charge?: string } =>
  fraisACharge1 == null || fraisACharge2 == null ? {} : { frais_a_charge: mergeArrayStrings(fraisACharge1, fraisACharge2) };

const mergePriseEnChargeSpecifique = (
  priseEnChargeSpecifique1?: string,
  priseEnChargeSpecifique2?: string
): { prise_en_charge_specifique?: string } =>
  priseEnChargeSpecifique1 == null || priseEnChargeSpecifique2 == null
    ? {}
    : { prise_en_charge_specifique: mergeArrayStrings(priseEnChargeSpecifique1, priseEnChargeSpecifique2) };

const mergePublicsSpecifiquementAdresses = (
  publicsSpecifiquementAdresses1?: string,
  publicsSpecifiquementAdresses2?: string
): { publics_specifiquement_adresses?: string } =>
  publicsSpecifiquementAdresses1 == null || publicsSpecifiquementAdresses2 == null
    ? {}
    : { publics_specifiquement_adresses: mergeArrayStrings(publicsSpecifiquementAdresses1, publicsSpecifiquementAdresses2) };

const mergeModalitesAcces = (modalitesAcces1?: string, modalitesAcces2?: string): { modalites_acces?: string } =>
  modalitesAcces1 == null || modalitesAcces2 == null
    ? {}
    : { modalites_acces: mergeArrayStrings(modalitesAcces1, modalitesAcces2) };

const mergeDispositifProgrammesNationaux = (
  dispositifProgrammesNationaux1?: string,
  dispositifProgrammesNationaux2?: string
): { dispositif_programmes_nationaux?: string } =>
  dispositifProgrammesNationaux1 == null && dispositifProgrammesNationaux2 == null
    ? {}
    : {
        dispositif_programmes_nationaux: mergeArrayStrings(
          dispositifProgrammesNationaux1 ?? '',
          dispositifProgrammesNationaux2 ?? ''
        )
      };

const mergeFormationsLabels = (formationsLabels1?: string, formationsLabels2?: string): { formations_labels?: string } =>
  formationsLabels1 == null || formationsLabels2 == null
    ? {}
    : { formations_labels: mergeArrayStrings(formationsLabels1, formationsLabels2) };

const mergeAutresFormationsLabels = (
  autresFormationsLabels1?: string,
  autresFormationsLabels2?: string
): { autres_formations_labels?: string } =>
  autresFormationsLabels1 == null || autresFormationsLabels2 == null
    ? {}
    : { autres_formations_labels: mergeArrayStrings(autresFormationsLabels1, autresFormationsLabels2) };

const mergeCourriels = (courriels1?: string, courriels2?: string): { courriels?: string } =>
  courriels1 == null || courriels2 == null ? {} : { courriels: mergeArrayStrings(courriels1, courriels2) };

const mergeSiteWeb = (siteWeb1?: string, siteWeb2?: string): { site_web?: string } =>
  siteWeb1 == null || siteWeb2 == null ? {} : { site_web: mergeArrayStrings(siteWeb1, siteWeb2) };

const mergeTypologie = (typologie1?: string, typologie2?: string): { typologie?: string } =>
  typologie1 == null || typologie2 == null ? {} : { typologie: mergeArrayStrings(typologie1, typologie2) };

const mergeId = (lieu1: SchemaLieuMediationNumerique, lieu2: SchemaLieuMediationNumerique): string =>
  [lieu1.id, lieu2.id]
    .sort()
    .join('__')
    .replace(/-?mediation-numerique-?/g, '');

const ignoreDefaultPivot = (lieu1: SchemaLieuMediationNumerique, lieu2: SchemaLieuMediationNumerique): { pivot: string } => ({
  pivot: lieu1.pivot === '00000000000000' ? lieu2.pivot : lieu1.pivot
});

export const mergeLieux = (
  lieu1: SchemaLieuMediationNumerique,
  lieu2?: SchemaLieuMediationNumerique
): SchemaLieuMediationNumerique =>
  lieu2 == null
    ? lieu1
    : {
        ...lieu2,
        ...lieu1,
        id: mergeId(lieu1, lieu2),
        ...ignoreDefaultPivot(lieu1, lieu2),
        ...mergeServices(lieu1.services, lieu2.services),
        ...mergeModalitesAccompagnement(lieu1.modalites_accompagnement, lieu2.modalites_accompagnement),
        ...mergeModalitesAcces(lieu1.modalites_acces, lieu2.modalites_acces),
        ...mergeFraisACharge(lieu1.frais_a_charge, lieu2.frais_a_charge),
        ...mergePriseEnChargeSpecifique(lieu1.prise_en_charge_specifique, lieu2.prise_en_charge_specifique),
        ...mergePublicsSpecifiquementAdresses(lieu1.publics_specifiquement_adresses, lieu2.publics_specifiquement_adresses),
        ...mergeDispositifProgrammesNationaux(lieu1.dispositif_programmes_nationaux, lieu2.dispositif_programmes_nationaux),
        ...mergeFormationsLabels(lieu1.formations_labels, lieu2.formations_labels),
        ...mergeAutresFormationsLabels(lieu1.autres_formations_labels, lieu2.autres_formations_labels),
        ...mergeCourriels(lieu1.courriels, lieu2.courriels),
        ...mergeSiteWeb(lieu1.site_web, lieu2.site_web),
        ...mergeTypologie(lieu1.typologie, lieu2.typologie)
      };

export const mergeOldLieux = (
  lieu1: SchemaLieuMediationNumerique,
  lieu2?: SchemaLieuMediationNumerique
): SchemaLieuMediationNumerique =>
  lieu2 == null
    ? lieu1
    : {
        ...lieu1,
        id: mergeId(lieu1, lieu2),
        ...mergeDispositifProgrammesNationaux(lieu1.dispositif_programmes_nationaux, lieu2.dispositif_programmes_nationaux)
      };
