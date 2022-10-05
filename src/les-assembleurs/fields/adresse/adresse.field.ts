// /* eslint-disable @typescript-eslint/naming-convention, camelcase, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Adresse, OptionalPropertyError } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Recorder } from '../../../tools';
import { LesAssembleursLieuMediationNumerique } from '../../helpers';
import { CLEAN_OPERATIONS, CleanOperation } from './clean-operations';

type FixedAdresse = LesAssembleursLieuMediationNumerique | undefined;

const formatCommune = (commune: string): string => commune.charAt(0).toUpperCase() + commune.slice(1);

const formatVoie = (adressePostale: string): string =>
  (adressePostale.includes('\n') ? adressePostale.substring(0, adressePostale.indexOf('\n')) : adressePostale).replace(
    /,/gu,
    ''
  );

const toLieuxMediationNumeriqueAdresse = (
  lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique
): Adresse =>
  Adresse({
    code_postal: lesAssembleursLieuMediationNumerique['Code postal'].toString(),
    commune: formatCommune(lesAssembleursLieuMediationNumerique.Commune),
    voie: formatVoie(lesAssembleursLieuMediationNumerique.Adresse)
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
    lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique
  ): LesAssembleursLieuMediationNumerique => {
    const cleanValue: string = cleanOperation.fix(valueToFix, lesAssembleursLieuMediationNumerique);
    recorder.fix({
      apply: cleanOperation.name,
      before: valueToFix,
      after: cleanValue
    });
    return {
      ...lesAssembleursLieuMediationNumerique,
      ...{
        [cleanOperation.field]: cleanValue
      }
    };
  };

const cannotApplyFix = (): LesAssembleursLieuMediationNumerique => {
  throw new Error();
};

const canFix = (cleanOperation: CleanOperation): cleanOperation is CleanOperation & { fix: (toFix: string) => string } =>
  cleanOperation.fix != null;

const applyCleanOperation =
  (recorder: Recorder) =>
  (
    cleanOperation: CleanOperation,
    valueToFix: string,
    lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique
  ): LesAssembleursLieuMediationNumerique =>
    canFix(cleanOperation)
      ? applyUpdateFix(recorder)(cleanOperation, valueToFix, lesAssembleursLieuMediationNumerique)
      : cannotApplyFix();

const toFixedAdresse =
  (recorder: Recorder) =>
  (lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique) =>
  (adresse: FixedAdresse, cleanOperation: CleanOperation): FixedAdresse =>
    adresse == null && shouldApplyFix(cleanOperation, lesAssembleursLieuMediationNumerique[cleanOperation.field].toString())
      ? applyCleanOperation(recorder)(
          cleanOperation,
          lesAssembleursLieuMediationNumerique[cleanOperation.field].toString(),
          lesAssembleursLieuMediationNumerique
        )
      : adresse;

const cannotFixAdresse = (error: unknown): Adresse => {
  throw error;
};

const retryOrThrow =
  (recorder: Recorder) =>
  (fixedAdresse: FixedAdresse, error: unknown): Adresse =>
    fixedAdresse == null ? cannotFixAdresse(error) : processAdresse(recorder)(fixedAdresse);

const fixAndRetry =
  (recorder: Recorder) =>
  (lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique, error: unknown): Adresse =>
    retryOrThrow(recorder)(
      CLEAN_OPERATIONS.reduce(toFixedAdresse(recorder)(lesAssembleursLieuMediationNumerique), undefined),
      error
    );

export const processAdresse =
  (recorder: Recorder) =>
  (lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique): Adresse => {
    try {
      const adresse: Adresse = toLieuxMediationNumeriqueAdresse(lesAssembleursLieuMediationNumerique);
      recorder.commit();
      return adresse;
    } catch (error: unknown) {
      error instanceof OptionalPropertyError && recorder.record(error.key, error.message);
      return fixAndRetry(recorder)(lesAssembleursLieuMediationNumerique, error);
    }
  };
