/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Adresse, OptionalPropertyError } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { cannotApplyFix, cannotFixAdresse, formatCommune, formatVoie, Recorder } from '../../../tools';
import { MaineEtLoireLieuMediationNumerique } from '../../helper';
import { CLEAN_OPERATIONS, CleanOperation } from './clean-operations';

type FixedAdresse = MaineEtLoireLieuMediationNumerique | undefined;

const toLieuxMediationNumeriqueAdresse = (maineEtLoireLieuMediationNumerique: MaineEtLoireLieuMediationNumerique): Adresse =>
  Adresse({
    code_postal: maineEtLoireLieuMediationNumerique.CP.toString(),
    commune: formatCommune(maineEtLoireLieuMediationNumerique.Commune),
    voie: formatVoie(maineEtLoireLieuMediationNumerique.Adresse)
  });

const testCleanSelector = (cleanOperation: CleanOperation, property?: string): boolean =>
  property != null && new RegExp(cleanOperation.selector, 'u').test(property);

const shouldApplyFix = (cleanOperation: CleanOperation, property?: string): boolean =>
  cleanOperation.negate === true ? !testCleanSelector(cleanOperation, property) : testCleanSelector(cleanOperation, property);

const applyUpdateFix =
  (recorder: Recorder) =>
  (
    cleanOperation: CleanOperation & { fix: (toFix: string) => string },
    valueToFix: string,
    maineEtLoireLieuMediationNumerique: MaineEtLoireLieuMediationNumerique
  ): MaineEtLoireLieuMediationNumerique => {
    const cleanValue: string = cleanOperation.fix(valueToFix, maineEtLoireLieuMediationNumerique);
    recorder.fix({
      apply: cleanOperation.name,
      before: valueToFix,
      after: cleanValue
    });
    return {
      ...maineEtLoireLieuMediationNumerique,
      ...{
        [cleanOperation.field]: cleanValue
      }
    };
  };

const canFix = (cleanOperation: CleanOperation): cleanOperation is CleanOperation & { fix: (toFix: string) => string } =>
  cleanOperation.fix != null;

const applyCleanOperation =
  (recorder: Recorder) =>
  (
    cleanOperation: CleanOperation,
    valueToFix: string,
    maineEtLoireLieuMediationNumerique: MaineEtLoireLieuMediationNumerique
  ): MaineEtLoireLieuMediationNumerique =>
    canFix(cleanOperation)
      ? applyUpdateFix(recorder)(cleanOperation, valueToFix, maineEtLoireLieuMediationNumerique)
      : cannotApplyFix<MaineEtLoireLieuMediationNumerique>();

const toFixedAdresse =
  (recorder: Recorder) =>
  (maineEtLoireLieuMediationNumerique: MaineEtLoireLieuMediationNumerique) =>
  (adresse: FixedAdresse, cleanOperation: CleanOperation): FixedAdresse =>
    adresse == null && shouldApplyFix(cleanOperation, maineEtLoireLieuMediationNumerique[cleanOperation.field].toString())
      ? applyCleanOperation(recorder)(
          cleanOperation,
          maineEtLoireLieuMediationNumerique[cleanOperation.field].toString(),
          maineEtLoireLieuMediationNumerique
        )
      : adresse;

const retryOrThrow =
  (recorder: Recorder) =>
  (fixedAdresse: FixedAdresse, error: unknown): Adresse =>
    fixedAdresse == null ? cannotFixAdresse<Adresse>(error) : processAdresse(recorder)(fixedAdresse);

const fixAndRetry =
  (recorder: Recorder) =>
  (maineEtLoireLieuMediationNumerique: MaineEtLoireLieuMediationNumerique, error: unknown): Adresse =>
    retryOrThrow(recorder)(
      CLEAN_OPERATIONS.reduce(toFixedAdresse(recorder)(maineEtLoireLieuMediationNumerique), undefined),
      error
    );

export const processAdresse =
  (recorder: Recorder) =>
  (maineEtLoireLieuMediationNumerique: MaineEtLoireLieuMediationNumerique): Adresse => {
    try {
      return toLieuxMediationNumeriqueAdresse(maineEtLoireLieuMediationNumerique);
    } catch (error: unknown) {
      error instanceof OptionalPropertyError && recorder.record(error.key, error.message);
      return fixAndRetry(recorder)(maineEtLoireLieuMediationNumerique, error);
    }
  };
