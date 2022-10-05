/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Contact, OptionalPropertyError, Url } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Recorder } from '../../../tools';
import { CLEAN_OPERATIONS, CleanOperation, EMAIL_FIELD, SITE_WEB_FIELD } from './clean-operations';
import { LesAssembleursLieuMediationNumerique } from '../../helpers';

type FixedContact = LesAssembleursLieuMediationNumerique | undefined;

const toInternationalFormat = (phone: string): string => (/^0\d{9}$/u.test(phone) ? `+33${phone.slice(1)}` : phone);

const formatPhone = (phone: string): string => toInternationalFormat(phone.replace(/[\s,.-]/gu, '').replace('(0)', ''));

const toLieuxMediationNumeriqueContact = (
  lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique
): Contact =>
  Contact({
    ...(lesAssembleursLieuMediationNumerique.Téléphone == null
      ? {}
      : { telephone: formatPhone(lesAssembleursLieuMediationNumerique.Téléphone.toString()) }),
    ...(lesAssembleursLieuMediationNumerique[SITE_WEB_FIELD] == null
      ? {}
      : { site_web: [Url(lesAssembleursLieuMediationNumerique[SITE_WEB_FIELD])] }),
    ...(lesAssembleursLieuMediationNumerique[EMAIL_FIELD] == null
      ? {}
      : {
          courriel: lesAssembleursLieuMediationNumerique[EMAIL_FIELD].trim()
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
    lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique
  ): LesAssembleursLieuMediationNumerique => {
    const { [cleanOperation.field]: removedProperty, ...filteredProperties }: LesAssembleursLieuMediationNumerique =
      lesAssembleursLieuMediationNumerique;
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
    lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique
  ): LesAssembleursLieuMediationNumerique => {
    const cleanValue: string = cleanOperation.fix(valueToFix);
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
      : applyRemoveFix(recorder)(cleanOperation, valueToFix, lesAssembleursLieuMediationNumerique);

const toFixedContact =
  (recorder: Recorder) =>
  (lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique) =>
  (contact: FixedContact, cleanOperation: CleanOperation): FixedContact =>
    contact == null && shouldApplyFix(cleanOperation, lesAssembleursLieuMediationNumerique[cleanOperation.field]?.toString())
      ? applyCleanOperation(recorder)(
          cleanOperation,
          lesAssembleursLieuMediationNumerique[cleanOperation.field]?.toString() ?? '',
          lesAssembleursLieuMediationNumerique
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
  (lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique, error: unknown): Contact =>
    retryOrThrow(recorder)(
      CLEAN_OPERATIONS.reduce(toFixedContact(recorder)(lesAssembleursLieuMediationNumerique), undefined),
      error
    );

export const processContact =
  (recorder: Recorder) =>
  (lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique): Contact => {
    try {
      const contact: Contact = toLieuxMediationNumeriqueContact(lesAssembleursLieuMediationNumerique);
      recorder.commit();
      return contact;
    } catch (error: unknown) {
      error instanceof OptionalPropertyError && recorder.record(error.key, error.message);
      return fixAndRetry(recorder)(lesAssembleursLieuMediationNumerique, error);
    }
  };
