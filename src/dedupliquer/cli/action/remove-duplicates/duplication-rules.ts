import { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';

export type Duplication = {
  id?: string;
  mergeId?: string;
  oldId?: string;
};

type DuplicationRule = (
  tooOld: Date
) => (lieu1: SchemaLieuMediationNumerique, lieu2: SchemaLieuMediationNumerique) => Duplication;

const selectDuplication =
  (tooOld: Date) =>
  (lieuDuplication: SchemaLieuMediationNumerique, lieu: SchemaLieuMediationNumerique): Duplication =>
    lieuDuplication.date_maj < tooOld.toISOString()
      ? { id: lieuDuplication.id, oldId: lieu.id }
      : { id: lieuDuplication.id, mergeId: lieu.id };

const dateDuplicationRule =
  (tooOld: Date) =>
  (lieu1: SchemaLieuMediationNumerique, lieu2: SchemaLieuMediationNumerique): Duplication =>
    lieu1.date_maj < lieu2.date_maj ? selectDuplication(tooOld)(lieu1, lieu2) : selectDuplication(tooOld)(lieu2, lieu1);

const DUPLICATION_RULES: DuplicationRule[] = [dateDuplicationRule];

export const applyDuplicationRules =
  (tooOld: Date) =>
  (lieu1?: SchemaLieuMediationNumerique, lieu2?: SchemaLieuMediationNumerique): Duplication =>
    lieu1 == null || lieu2 == null
      ? {}
      : DUPLICATION_RULES.reduce(
          (duplication: Duplication, duplicationRule: DuplicationRule): Duplication =>
            duplication.id == null ? duplicationRule(tooOld)(lieu1, lieu2) : duplication,
          {}
        );
