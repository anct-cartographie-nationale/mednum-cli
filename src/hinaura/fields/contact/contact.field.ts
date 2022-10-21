import { Contact, Url } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { HinauraLieuMediationNumerique } from '../../helper';

const EMAIL_FIELD =
  "Email (éviter les emails nominatifs - en cas d'email nominitatif seule la personne concernée est autorisé à l'ajouter)";

const toLieuxMediationNumeriqueContact = (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique): Contact =>
  Contact({
    ...(hinauraLieuMediationNumerique.Téléphone ? { telephone: hinauraLieuMediationNumerique.Téléphone.toString() } : {}),
    ...(hinauraLieuMediationNumerique['Site Web'] ? { site_web: [Url(hinauraLieuMediationNumerique['Site Web'])] } : {}),
    ...(hinauraLieuMediationNumerique[EMAIL_FIELD]
      ? {
          courriel: hinauraLieuMediationNumerique[EMAIL_FIELD]
        }
      : {})
  });

type CleanOperation = {
  selector: RegExp;
  field:
    | 'Site Web'
    | 'Téléphone'
    | "Email (éviter les emails nominatifs - en cas d'email nominitatif seule la personne concernée est autorisé à l'ajouter)";
  negate?: boolean;
  fix?: (toFix: string) => string;
};

type FixedContact = HinauraLieuMediationNumerique | undefined;

const REMOVE_HTTP_ONLY_WEBSITES: CleanOperation = {
  selector: /^http:\/\/$/u,
  field: 'Site Web'
};

const FIX_NO_HTTP_WEBSITES: CleanOperation = {
  selector: /^(?!http:\/\/).*/u,
  field: 'Site Web',
  fix: (toFix: string): string => `http://${toFix}`
};

const FIX_WRONG_CHARS_IN_PHONE: CleanOperation = {
  selector: /(?!\d|\+)./gu,
  field: 'Téléphone',
  fix: (toFix: string): string => toFix.toString().replace(/(?!\d|\+)./gu, '')
};

const FIX_UNEXPECTED_PHONE_LIST: CleanOperation = {
  selector: /\d{10}\/\d{10}/u,
  field: 'Téléphone',
  fix: (toFix: string): string => toFix.toString().split('/')[0] ?? ''
};

const FIX_PHONE_WITHOUT_STARTING_0: CleanOperation = {
  selector: /^\d{9}$/u,
  field: 'Téléphone',
  fix: (toFix: string): string => `+33${toFix}`
};

const FIX_NO_INTERNATIONAL_CAF_PHONE: CleanOperation = {
  selector: /3230/u,
  field: 'Téléphone',
  fix: (): string => '+33969322121'
};

const REMOVE_TOO_FEW_DIGITS_IN_PHONE: CleanOperation = {
  selector: /^.{0,8}$/u,
  field: 'Téléphone'
};

const REMOVE_TOO_MANY_DIGITS_IN_PHONE: CleanOperation = {
  selector: /^0.{10,}/u,
  field: 'Téléphone'
};

const REMOVE_EMAIL_STARTING_WITH_WWW: CleanOperation = {
  selector: /^www\./u,
  field: EMAIL_FIELD
};

const FIX_UNEXPECTED_EMAIL_LABEL: CleanOperation = {
  selector: /\S\s:\s\S/u,
  field: EMAIL_FIELD,
  fix: (toFix: string): string => toFix.toString().split(/\s:\s/u)[1] ?? ''
};

const FIX_UNEXPECTED_EMAIL_LIST: CleanOperation = {
  selector: /\S\s?(?:et|ou|;|\s|\/)\s?\S/u,
  field: EMAIL_FIELD,
  fix: (toFix: string): string => toFix.toString().split(/\s?(?:et|ou|;|\s|\/)\s?/u)[0] ?? ''
};

const FIX_MISSING_AT_IN_EMAIL: CleanOperation = {
  selector: /\[a\]/gu,
  field: EMAIL_FIELD,
  fix: (toFix: string): string => toFix.toString().replace('[a]', '@')
};

const FIX_MISSING_EMAIL_EXTENSION: CleanOperation = {
  selector: /\.[a-z]{2,3}$/u,
  field: EMAIL_FIELD,
  negate: true
};

const CLEAN_OPERATIONS: CleanOperation[] = [
  REMOVE_HTTP_ONLY_WEBSITES,
  FIX_NO_HTTP_WEBSITES,
  FIX_UNEXPECTED_PHONE_LIST,
  FIX_WRONG_CHARS_IN_PHONE,
  FIX_WRONG_CHARS_IN_PHONE,
  FIX_PHONE_WITHOUT_STARTING_0,
  FIX_NO_INTERNATIONAL_CAF_PHONE,
  REMOVE_TOO_FEW_DIGITS_IN_PHONE,
  REMOVE_TOO_MANY_DIGITS_IN_PHONE,
  REMOVE_EMAIL_STARTING_WITH_WWW,
  FIX_UNEXPECTED_EMAIL_LABEL,
  FIX_UNEXPECTED_EMAIL_LIST,
  FIX_MISSING_AT_IN_EMAIL,
  FIX_MISSING_EMAIL_EXTENSION
];

const testCleanSelector = (cleanOperation: CleanOperation, property?: string | number): boolean =>
  (property != null && cleanOperation.selector.test(property.toString())) ?? false;

const shouldApplyFix = (cleanOperation: CleanOperation, property?: string | number): boolean =>
  cleanOperation.negate === true ? !testCleanSelector(cleanOperation, property) : testCleanSelector(cleanOperation, property);

const applyRemoveFix = (
  hinauraLieuMediationNumerique: HinauraLieuMediationNumerique,
  cleanOperation: CleanOperation
): HinauraLieuMediationNumerique => {
  const { [cleanOperation.field]: removedProperty, ...filteredSiteWeb } = hinauraLieuMediationNumerique;
  return filteredSiteWeb;
};

const applyFix = (
  hinauraLieuMediationNumerique: HinauraLieuMediationNumerique,
  cleanOperation: CleanOperation
): HinauraLieuMediationNumerique =>
  cleanOperation.fix == null
    ? applyRemoveFix(hinauraLieuMediationNumerique, cleanOperation)
    : {
        ...hinauraLieuMediationNumerique,
        ...{
          [cleanOperation.field]: cleanOperation.fix(hinauraLieuMediationNumerique[cleanOperation.field]?.toString() ?? '')
        }
      };

const toFixedContact =
  (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique) =>
  (contact: FixedContact, cleanOperation: CleanOperation): FixedContact =>
    contact == null && shouldApplyFix(cleanOperation, hinauraLieuMediationNumerique[cleanOperation.field]?.toString())
      ? applyFix(hinauraLieuMediationNumerique, cleanOperation)
      : contact;

const cannotFixContact = (error: unknown): Contact => {
  throw error;
};

const retryOrThrow = (fixedContact: FixedContact, error: unknown): Contact =>
  fixedContact != null ? processContact(fixedContact) : cannotFixContact(error);

const fixAndRetry = (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique, error: unknown): Contact =>
  retryOrThrow(CLEAN_OPERATIONS.reduce(toFixedContact(hinauraLieuMediationNumerique), undefined), error);

export const processContact = (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique): Contact => {
  try {
    return toLieuxMediationNumeriqueContact(hinauraLieuMediationNumerique);
  } catch (error: unknown) {
    return fixAndRetry(hinauraLieuMediationNumerique, error);
  }
};
