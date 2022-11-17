/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Contact, OptionalPropertyError, Url } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { cannotFixContact, formatPhone, Recorder } from '../../../tools';
import { MaineEtLoireLieuMediationNumerique } from '../../helper';
import { CLEAN_OPERATIONS, CleanOperation } from './clean-operations';

type FixedContact = MaineEtLoireLieuMediationNumerique | undefined;

const toLieuxMediationNumeriqueContact = (maineEtLoireLieuMediationNumerique: MaineEtLoireLieuMediationNumerique): Contact =>
  Contact({
    ...(maineEtLoireLieuMediationNumerique.Téléphone == null
      ? {}
      : { telephone: formatPhone(maineEtLoireLieuMediationNumerique.Téléphone.toString()) }),
    ...(maineEtLoireLieuMediationNumerique['Site web'] == null
      ? {}
      : { site_web: [Url(maineEtLoireLieuMediationNumerique['Site web'])] }),
    ...(maineEtLoireLieuMediationNumerique.Courriel == null
      ? {}
      : {
          courriel: maineEtLoireLieuMediationNumerique.Courriel
        })
  });

const testCleanSelector = (cleanOperation: CleanOperation, property?: string): boolean =>
  property != null && new RegExp(cleanOperation.selector, 'u').test(property);

const shouldApplyFix = (cleanOperation: CleanOperation, property?: string): boolean =>
  cleanOperation.negate === true ? !testCleanSelector(cleanOperation, property) : testCleanSelector(cleanOperation, property);

const applyRemoveFix =
  (recorder: Recorder) =>
  (
    cleanOperation: CleanOperation,
    valueToFix: string,
    maineEtLoireLieuMediationNumerique: MaineEtLoireLieuMediationNumerique
  ): MaineEtLoireLieuMediationNumerique => {
    const { [cleanOperation.field]: removedProperty, ...filteredProperties }: MaineEtLoireLieuMediationNumerique =
      maineEtLoireLieuMediationNumerique;
    recorder.fix({
      apply: cleanOperation.name,
      before: valueToFix
    });
    return filteredProperties;
  };

const applyUpdateFix =
  (recorder: Recorder) =>
  (
    cleanOperation: CleanOperation & { fix: (toFix: string) => string },
    valueToFix: string,
    maineEtLoireLieuMediationNumerique: MaineEtLoireLieuMediationNumerique
  ): MaineEtLoireLieuMediationNumerique => {
    const cleanValue: string = cleanOperation.fix(valueToFix);
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
      : applyRemoveFix(recorder)(cleanOperation, valueToFix, maineEtLoireLieuMediationNumerique);

const toFixedContact =
  (recorder: Recorder) =>
  (maineEtLoireLieuMediationNumerique: MaineEtLoireLieuMediationNumerique) =>
  (contact: FixedContact, cleanOperation: CleanOperation): FixedContact =>
    contact == null && shouldApplyFix(cleanOperation, maineEtLoireLieuMediationNumerique[cleanOperation.field]?.toString())
      ? applyCleanOperation(recorder)(
          cleanOperation,
          maineEtLoireLieuMediationNumerique[cleanOperation.field]?.toString() ?? '',
          maineEtLoireLieuMediationNumerique
        )
      : contact;

const retryOrThrow =
  (recorder: Recorder) =>
  (fixedContact: FixedContact, error: unknown): Contact =>
    fixedContact == null ? cannotFixContact(error) : processContact(recorder)(fixedContact);

const fixAndRetry =
  (recorder: Recorder) =>
  (maineEtLoireLieuMediationNumerique: MaineEtLoireLieuMediationNumerique, error: unknown): Contact =>
    retryOrThrow(recorder)(
      CLEAN_OPERATIONS.reduce(toFixedContact(recorder)(maineEtLoireLieuMediationNumerique), undefined),
      error
    );

export const processContact =
  (recorder: Recorder) =>
  (maineEtLoireLieuMediationNumerique: MaineEtLoireLieuMediationNumerique): Contact => {
    try {
      return toLieuxMediationNumeriqueContact(maineEtLoireLieuMediationNumerique);
    } catch (error: unknown) {
      error instanceof OptionalPropertyError && recorder.record(error.key, error.message);
      return fixAndRetry(recorder)(maineEtLoireLieuMediationNumerique, error);
    }
  };
