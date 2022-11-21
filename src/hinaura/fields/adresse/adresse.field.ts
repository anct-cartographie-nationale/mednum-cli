// /* eslint-disable @typescript-eslint/naming-convention, camelcase */

// import { Adresse, OptionalPropertyError } from '@gouvfr-anct/lieux-de-mediation-numerique';
// import { HinauraLieuMediationNumerique } from '../../../hinaura/helper';
// import { cannotApplyFix, cannotFixAdresse, formatCommune, formatVoie, Recorder } from '../../../tools';
// import { CLEAN_OPERATIONS, CleanOperation } from './clean-operations';

// type FixedAdresse = HinauraLieuMediationNumerique | undefined;

// const toLieuxMediationNumeriqueAdresse = (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique): Adresse =>
//   Adresse({
//     code_postal: hinauraLieuMediationNumerique['Code postal'],
//     commune: formatCommune(hinauraLieuMediationNumerique['Ville *']),
//     voie: formatVoie(hinauraLieuMediationNumerique['Adresse postale *'])
//   });

// const testCleanSelector = (cleanOperation: CleanOperation, property?: string): boolean =>
//   property != null && new RegExp(cleanOperation.selector, 'u').test(property);

// const shouldApplyFix = (cleanOperation: CleanOperation, property?: string): boolean =>
//   cleanOperation.negate === true ? !testCleanSelector(cleanOperation, property) : testCleanSelector(cleanOperation, property);

// const applyUpdateFix =
//   (recorder: Recorder) =>
//   (
//     cleanOperation: CleanOperation & { fix: (toFix: string) => string },
//     valueToFix: string,
//     hinauraLieuMediationNumerique: HinauraLieuMediationNumerique
//   ): HinauraLieuMediationNumerique => {
//     const cleanValue: string = cleanOperation.fix(valueToFix, hinauraLieuMediationNumerique);
//     recorder.fix({
//       apply: cleanOperation.name,
//       before: valueToFix,
//       after: cleanValue
//     });
//     return {
//       ...hinauraLieuMediationNumerique,
//       ...{
//         [cleanOperation.field]: cleanValue
//       }
//     };
//   };

// const canFix = (cleanOperation: CleanOperation): cleanOperation is CleanOperation & { fix: (toFix: string) => string } =>
//   cleanOperation.fix != null;

// const applyCleanOperation =
//   (recorder: Recorder) =>
//   (
//     cleanOperation: CleanOperation,
//     valueToFix: string,
//     hinauraLieuMediationNumerique: HinauraLieuMediationNumerique
//   ): HinauraLieuMediationNumerique =>
//     canFix(cleanOperation)
//       ? applyUpdateFix(recorder)(cleanOperation, valueToFix, hinauraLieuMediationNumerique)
//       : cannotApplyFix<HinauraLieuMediationNumerique>();

// const toFixedAdresse =
//   (recorder: Recorder) =>
//   (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique) =>
//   (
//     adresse: HinauraLieuMediationNumerique | undefined,
//     cleanOperation: CleanOperation
//   ): HinauraLieuMediationNumerique | undefined =>
//     adresse == null && shouldApplyFix(cleanOperation, hinauraLieuMediationNumerique[cleanOperation.field].toString())
//       ? applyCleanOperation(recorder)(
//           cleanOperation,
//           hinauraLieuMediationNumerique[cleanOperation.field].toString(),
//           hinauraLieuMediationNumerique
//         )
//       : adresse;

// const retryOrThrow =
//   (recorder: Recorder) =>
//   (fixedAdresse: FixedAdresse, error: unknown): Adresse =>
//     fixedAdresse == null ? cannotFixAdresse<Adresse>(error) : processAdresse(recorder)(fixedAdresse);

// const fixAndRetry =
//   (recorder: Recorder) =>
//   (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique, error: unknown): Adresse =>
//     retryOrThrow(recorder)(CLEAN_OPERATIONS.reduce(toFixedAdresse(recorder)(hinauraLieuMediationNumerique), undefined), error);

// export const processAdresse =
//   (recorder: Recorder) =>
//   (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique): Adresse => {
//     try {
//       return toLieuxMediationNumeriqueAdresse(hinauraLieuMediationNumerique);
//     } catch (error: unknown) {
//       error instanceof OptionalPropertyError && recorder.record(error.key, error.message);
//       return fixAndRetry(recorder)(hinauraLieuMediationNumerique, error);
//     }
//   };

/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Adresse, OptionalPropertyError } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Recorder } from '../../../tools';
import { HinauraLieuMediationNumerique } from '../../helper';
import { CLEAN_OPERATIONS, CleanOperation } from './clean-operations';

type FixedAdresse = HinauraLieuMediationNumerique | undefined;

const formatCommune = (commune: string): string => commune.charAt(0).toUpperCase() + commune.slice(1);

const formatVoie = (adressePostale: string): string =>
  (adressePostale.includes('\n') ? adressePostale.substring(0, adressePostale.indexOf('\n')) : adressePostale).replace(
    /,/gu,
    ''
  );

const toLieuxMediationNumeriqueAdresse = (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique): Adresse =>
  Adresse({
    code_postal: hinauraLieuMediationNumerique['Code postal'],
    commune: formatCommune(hinauraLieuMediationNumerique['Ville *']),
    voie: formatVoie(hinauraLieuMediationNumerique['Adresse postale *'])
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
    hinauraLieuMediationNumerique: HinauraLieuMediationNumerique
  ): HinauraLieuMediationNumerique => {
    const cleanValue: string = cleanOperation.fix(valueToFix, hinauraLieuMediationNumerique);
    recorder.fix({
      apply: cleanOperation.name,
      before: valueToFix,
      after: cleanValue
    });
    return {
      ...hinauraLieuMediationNumerique,
      ...{
        [cleanOperation.field]: cleanValue
      }
    };
  };

const cannotApplyFix = (): HinauraLieuMediationNumerique => {
  throw new Error();
};

const canFix = (cleanOperation: CleanOperation): cleanOperation is CleanOperation & { fix: (toFix: string) => string } =>
  cleanOperation.fix != null;

const applyCleanOperation =
  (recorder: Recorder) =>
  (
    cleanOperation: CleanOperation,
    valueToFix: string,
    hinauraLieuMediationNumerique: HinauraLieuMediationNumerique
  ): HinauraLieuMediationNumerique =>
    canFix(cleanOperation)
      ? applyUpdateFix(recorder)(cleanOperation, valueToFix, hinauraLieuMediationNumerique)
      : cannotApplyFix();

const toFixedAdresse =
  (recorder: Recorder) =>
  (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique) =>
  (adresse: FixedAdresse, cleanOperation: CleanOperation): FixedAdresse =>
    adresse == null && shouldApplyFix(cleanOperation, hinauraLieuMediationNumerique[cleanOperation.field].toString())
      ? applyCleanOperation(recorder)(
          cleanOperation,
          hinauraLieuMediationNumerique[cleanOperation.field].toString(),
          hinauraLieuMediationNumerique
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
  (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique, error: unknown): Adresse =>
    retryOrThrow(recorder)(CLEAN_OPERATIONS.reduce(toFixedAdresse(recorder)(hinauraLieuMediationNumerique), undefined), error);

export const processAdresse =
  (recorder: Recorder) =>
  (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique): Adresse => {
    try {
      return toLieuxMediationNumeriqueAdresse(hinauraLieuMediationNumerique);
    } catch (error: unknown) {
      error instanceof OptionalPropertyError && recorder.record(error.key, error.message);
      return fixAndRetry(recorder)(hinauraLieuMediationNumerique, error);
    }
  };
