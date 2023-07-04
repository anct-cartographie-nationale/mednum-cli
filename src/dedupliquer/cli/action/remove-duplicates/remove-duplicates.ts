/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { DuplicationComparison, duplicationComparisons } from '../duplication-comparisons';
import { applyDuplicationRules, Duplication } from './duplication-rules';

const DAYS_IN_YEAR: 365 = 365 as const;
const MILLISECONDS_IN_DAY: number = 24 * 60 * 60 * 1000;
const DATE_LIMIT_OFFSET: number = (DAYS_IN_YEAR / 2) * MILLISECONDS_IN_DAY;

const DUPLICATION_SCORE_THRESHOLD: 60 = 60 as const;

const onlyNonDuplicates =
  (idToRemove: string[]) =>
  (lieu: SchemaLieuMediationNumerique): boolean =>
    !idToRemove.includes(lieu.id);

const onlyMoreThanDuplicationScoreThreshold = (duplicationComparison: DuplicationComparison): boolean =>
  duplicationComparison.score > DUPLICATION_SCORE_THRESHOLD;

const onlyDefinedId = (id?: string): id is string => id != null;

const byId =
  (id: string) =>
  (lieu: SchemaLieuMediationNumerique): boolean =>
    lieu.id === id;

const byMergeId =
  (lieu: SchemaLieuMediationNumerique) =>
  (duplicate: Duplication): boolean =>
    duplicate.mergeId === lieu.id;

const toIdToRemove = (duplicate: Duplication): string | undefined => duplicate.id;

const toDuplicates =
  (now: Date) =>
  (lieux: SchemaLieuMediationNumerique[]) =>
  (duplicationComparison: DuplicationComparison): Duplication =>
    applyDuplicationRules(new Date(now.getTime() - DATE_LIMIT_OFFSET))(
      lieux.find(byId(duplicationComparison.id1)),
      lieux.find(byId(duplicationComparison.id2))
    );

const ignoreDefaultPivot = (lieu1: SchemaLieuMediationNumerique, lieu2: SchemaLieuMediationNumerique): { pivot: string } => ({
  pivot: lieu1.pivot === '00000000000000' ? lieu2.pivot : lieu1.pivot
});

const mergeServices = (lieu1: SchemaLieuMediationNumerique, lieu2?: SchemaLieuMediationNumerique): { services: string } =>
  lieu2 == null
    ? { services: lieu1.services }
    : { services: Array.from(new Set([...lieu1.services.split(';'), ...lieu2.services.split(';')])).join(';') };

const mergeArrayStrings = (arrayString1: string, arrayString2: string): string =>
  Array.from(new Set([...arrayString1.split(';'), ...arrayString2.split(';')])).join(';');

const mergeModalitesAccompagnement = (
  modalitesAccompagnement1?: string,
  modalitesAccompagnement2?: string
): { modalites_accompagnement?: string } =>
  modalitesAccompagnement1 == null || modalitesAccompagnement2 == null
    ? {}
    : { modalites_accompagnement: mergeArrayStrings(modalitesAccompagnement1, modalitesAccompagnement2) };

const mergeConditionsAcces = (conditionsAcces1?: string, conditionsAcces2?: string): { conditions_acces?: string } =>
  conditionsAcces1 == null || conditionsAcces2 == null
    ? {}
    : { conditions_acces: mergeArrayStrings(conditionsAcces1, conditionsAcces2) };

const mergePublicsAccueillis = (publicsAccueillis1?: string, publicsAccueillis2?: string): { publics_accueillis?: string } =>
  publicsAccueillis1 == null || publicsAccueillis2 == null
    ? {}
    : { publics_accueillis: mergeArrayStrings(publicsAccueillis1, publicsAccueillis2) };

const mergeLabelsNationaux = (labelsNationaux1?: string, labelsNationaux2?: string): { labels_nationaux?: string } =>
  labelsNationaux1 == null || labelsNationaux2 == null
    ? {}
    : { labels_nationaux: mergeArrayStrings(labelsNationaux1, labelsNationaux2) };

const mergeLabelsAutres = (labelsAutres1?: string, labelsAutres2?: string): { labels_autres?: string } =>
  labelsAutres1 == null || labelsAutres2 == null ? {} : { labels_autres: mergeArrayStrings(labelsAutres1, labelsAutres2) };

const mergeSiteWeb = (siteWeb1?: string, siteWeb2?: string): { site_web?: string } =>
  siteWeb1 == null || siteWeb2 == null ? {} : { site_web: mergeArrayStrings(siteWeb1, siteWeb2) };

const mergeTypologie = (typologie1?: string, typologie2?: string): { typologie?: string } =>
  typologie1 == null || typologie2 == null ? {} : { typologie: mergeArrayStrings(typologie1, typologie2) };

const mergeLieux = (lieu1: SchemaLieuMediationNumerique, lieu2?: SchemaLieuMediationNumerique): SchemaLieuMediationNumerique =>
  lieu2 == null
    ? lieu1
    : {
        ...lieu2,
        ...lieu1,
        ...ignoreDefaultPivot(lieu1, lieu2),
        ...mergeServices(lieu1, lieu2),
        ...mergeModalitesAccompagnement(lieu1.modalites_accompagnement, lieu2.modalites_accompagnement),
        ...mergeConditionsAcces(lieu1.conditions_acces, lieu2.conditions_acces),
        ...mergePublicsAccueillis(lieu1.publics_accueillis, lieu2.publics_accueillis),
        ...mergeLabelsNationaux(lieu1.labels_nationaux, lieu2.labels_nationaux),
        ...mergeLabelsAutres(lieu1.labels_autres, lieu2.labels_autres),
        ...mergeSiteWeb(lieu1.site_web, lieu2.site_web),
        ...mergeTypologie(lieu1.typologie, lieu2.typologie)
      };

const toMergeWithDuplicates =
  (lieux: SchemaLieuMediationNumerique[], duplicateToMergeId?: string) =>
  (lieu: SchemaLieuMediationNumerique): SchemaLieuMediationNumerique =>
    duplicateToMergeId == null ? lieu : mergeLieux(lieu, lieux.find(byId(duplicateToMergeId)));

const applyRemoveAndMergeRules = (
  lieux: SchemaLieuMediationNumerique[],
  duplicates: Duplication[]
): SchemaLieuMediationNumerique[] =>
  lieux
    .filter(onlyNonDuplicates(duplicates.map(toIdToRemove).filter(onlyDefinedId)))
    .map(
      (lieu: SchemaLieuMediationNumerique): SchemaLieuMediationNumerique =>
        toMergeWithDuplicates(lieux, duplicates.find(byMergeId(lieu))?.id)(lieu)
    );

export const removeDuplicates =
  (now: Date) =>
  (lieux: SchemaLieuMediationNumerique[]): SchemaLieuMediationNumerique[] =>
    applyRemoveAndMergeRules(
      lieux,
      duplicationComparisons(lieux).filter(onlyMoreThanDuplicationScoreThreshold).map(toDuplicates(now)(lieux))
    );
