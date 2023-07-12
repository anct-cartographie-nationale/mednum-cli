/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Contact, Url } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
import { Recorder } from '../../report/report';
import { cleanOperations, CleanOperation } from './clean-operations';

type FixedContact = DataSource | undefined;

const toInternationalFormat = (phone: string): string => (/^0\d{9}$/u.test(phone) ? `+33${phone.slice(1)}` : phone);

const telephoneField = (telephone?: number | string): Pick<Contact, 'telephone'> => {
  const singlePhoneNumber: string = telephone?.toString().split('\n')[0] ?? '';
  return telephone == null
    ? {}
    : {
        telephone: toInternationalFormat(
          singlePhoneNumber
            .toString()
            .replace(/[\s,.-]/gu, '')
            .replace('(0)', '')
            .trim()
        )
      };
};

const siteWebField = (siteWeb?: string): Pick<Contact, 'site_web'> =>
  siteWeb == null ? {} : { site_web: siteWeb.replace(/\n/gu, '').split(';').map(Url) };

const courrielField = (courriel?: string): Pick<Contact, 'courriel'> =>
  courriel == null || courriel === '' ? {} : { courriel };

const toLieuxMediationNumeriqueContact = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Contact =>
  Contact({
    ...(matching.telephone?.colonne == null ? {} : telephoneField(source[matching.telephone.colonne])),
    ...(matching.site_web?.colonne == null ? {} : siteWebField(source[matching.site_web.colonne]?.toLowerCase())),
    ...(matching.courriel?.colonne == null ? {} : courrielField(source[matching.courriel.colonne]))
  });

const testCleanSelector = (cleanOperation: CleanOperation, property?: string): boolean =>
  property != null && new RegExp(cleanOperation.selector, 'u').test(property);

const shouldApplyFix = (cleanOperation: CleanOperation, property?: string): boolean =>
  cleanOperation.negate === true ? !testCleanSelector(cleanOperation, property) : testCleanSelector(cleanOperation, property);

const applyRemoveFix =
  (recorder: Recorder) =>
  (cleanOperation: CleanOperation, valueToFix: string, source: DataSource): DataSource => {
    const { [cleanOperation.field]: removedProperty, ...filteredProperties }: DataSource = source;
    recorder.fix({
      apply: cleanOperation.name,
      before: valueToFix
    });
    return filteredProperties;
  };

const applyUpdateFix =
  (recorder: Recorder) =>
  (cleanOperation: CleanOperation & { fix: (toFix: string) => string }, valueToFix: string, source: DataSource): DataSource => {
    const cleanValue: string = cleanOperation.fix(valueToFix);
    recorder.fix({
      apply: cleanOperation.name,
      before: valueToFix,
      after: cleanValue
    });

    return {
      ...source,
      ...{
        [cleanOperation.field]: cleanValue
      }
    };
  };

const canFix = (cleanOperation: CleanOperation): cleanOperation is CleanOperation & { fix: (toFix: string) => string } =>
  cleanOperation.fix != null;

const applyCleanOperation =
  (recorder: Recorder) =>
  (cleanOperation: CleanOperation, valueToFix: string, source: DataSource): DataSource =>
    canFix(cleanOperation)
      ? applyUpdateFix(recorder)(cleanOperation, valueToFix, source)
      : applyRemoveFix(recorder)(cleanOperation, valueToFix, source);

const toFixedContact =
  (recorder: Recorder) =>
  (source: DataSource) =>
  (contact: FixedContact, cleanOperation: CleanOperation): FixedContact =>
    contact == null && shouldApplyFix(cleanOperation, source[cleanOperation.field]?.toString())
      ? applyCleanOperation(recorder)(cleanOperation, source[cleanOperation.field]?.toString() ?? '', source)
      : contact;

const cannotFixContact = (error: unknown): Contact => {
  throw error;
};

const retryOrThrow =
  (recorder: Recorder) =>
  (fixedContact: FixedContact, matching: LieuxMediationNumeriqueMatching, error: unknown): Contact =>
    fixedContact == null ? cannotFixContact(error) : processContact(recorder)(fixedContact, matching);

const fixAndRetry =
  (recorder: Recorder) =>
  (source: DataSource, matching: LieuxMediationNumeriqueMatching, error: unknown): Contact =>
    retryOrThrow(recorder)(
      cleanOperations(matching, source[matching.code_postal.colonne]).reduce(toFixedContact(recorder)(source), undefined),
      matching,
      error
    );

export const processContact =
  (recorder: Recorder) =>
  (source: DataSource, matching: LieuxMediationNumeriqueMatching): Contact => {
    try {
      return toLieuxMediationNumeriqueContact(source, matching);
    } catch (error: unknown) {
      return fixAndRetry(recorder)(source, matching, error);
    }
  };
