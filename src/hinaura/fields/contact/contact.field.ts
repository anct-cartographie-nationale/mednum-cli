/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Contact, OptionalPropertyError, Url } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { HinauraLieuMediationNumerique } from '../../helper';
import { Recorder } from '../../../tools';
import { CLEAN_OPERATIONS, CleanOperation, EMAIL_FIELD } from './clean-operations';

type FixedContact = HinauraLieuMediationNumerique | undefined;

const toInternationalFormat = (phone: string): string => (/^0\d{9}$/u.test(phone) ? `+33${phone.slice(1)}` : phone);

const formatPhone = (phone: string): string => toInternationalFormat(phone.replace(/[\s,.-]/gu, '').replace('(0)', ''));

const toLieuxMediationNumeriqueContact = (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique): Contact =>
  Contact({
    ...(hinauraLieuMediationNumerique.Téléphone == null
      ? {}
      : { telephone: formatPhone(hinauraLieuMediationNumerique.Téléphone.toString()) }),
    ...(hinauraLieuMediationNumerique['Site Web'] == null
      ? {}
      : { site_web: [Url(hinauraLieuMediationNumerique['Site Web'])] }),
    ...(hinauraLieuMediationNumerique[EMAIL_FIELD] == null
      ? {}
      : {
          courriel: hinauraLieuMediationNumerique[EMAIL_FIELD]
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
    hinauraLieuMediationNumerique: HinauraLieuMediationNumerique
  ): HinauraLieuMediationNumerique => {
    const { [cleanOperation.field]: removedProperty, ...filteredProperties }: HinauraLieuMediationNumerique =
      hinauraLieuMediationNumerique;
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
    hinauraLieuMediationNumerique: HinauraLieuMediationNumerique
  ): HinauraLieuMediationNumerique => {
    const cleanValue: string = cleanOperation.fix(valueToFix);
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
      : applyRemoveFix(recorder)(cleanOperation, valueToFix, hinauraLieuMediationNumerique);

const toFixedContact =
  (recorder: Recorder) =>
  (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique) =>
  (contact: FixedContact, cleanOperation: CleanOperation): FixedContact =>
    contact == null && shouldApplyFix(cleanOperation, hinauraLieuMediationNumerique[cleanOperation.field]?.toString())
      ? applyCleanOperation(recorder)(
          cleanOperation,
          hinauraLieuMediationNumerique[cleanOperation.field]?.toString() ?? '',
          hinauraLieuMediationNumerique
        )
      : contact;

const cannotFixContact = (error: unknown): Contact => {
  throw error;
};

const retryOrThrow =
  (recorder: Recorder) =>
  (fixedContact: FixedContact, error: unknown): Contact =>
    fixedContact == null ? cannotFixContact(error) : processContact(recorder)(fixedContact);

const fixAndRetry =
  (recorder: Recorder) =>
  (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique, error: unknown): Contact =>
    retryOrThrow(recorder)(CLEAN_OPERATIONS.reduce(toFixedContact(recorder)(hinauraLieuMediationNumerique), undefined), error);

export const processContact =
  (recorder: Recorder) =>
  (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique): Contact => {
    try {
      return toLieuxMediationNumeriqueContact(hinauraLieuMediationNumerique);
    } catch (error: unknown) {
      error instanceof OptionalPropertyError && recorder.record(error.key, error.message);
      return fixAndRetry(recorder)(hinauraLieuMediationNumerique, error);
    }
  };
