export type CleanOperation = {
  name: string;
  selector: RegExp;
  field: 'Site web' | 'Courriel' | 'Téléphone';
  negate?: boolean;
  fix?: (toFix: string) => string;
};

const REMOVE_HTTP_ONLY_WEBSITES: CleanOperation = {
  name: 'http only websites',
  selector: /^http:\/\/$/u,
  field: 'Site web'
};

const FIX_MISSING_HTTP_WEBSITES: CleanOperation = {
  name: 'missing http websites',
  selector: /^(?!(http:)\/\/).*/u,
  field: 'Site web',
  fix: (toFix: string): string => `http://${toFix}`
};

const FIX_HEADING_DETAILS_IN_PHONE: CleanOperation = {
  name: 'heading details in phone',
  selector: /^\D{3,}/gu,
  field: 'Téléphone',
  fix: (toFix: string): string => toFix.replace(/^\D{3,}/gu, '')
};

const FIX_TRAILING_DETAILS_IN_PHONE: CleanOperation = {
  name: 'trailing details in phone',
  selector: /\s[A-Za-z].*$/gu,
  field: 'Téléphone',
  fix: (toFix: string): string => toFix.replace(/\s[A-Za-z].*$/gu, '')
};

const FIX_WRONG_CHARS_IN_PHONE: CleanOperation = {
  name: 'wrong chars in phone',
  selector: /(?!\w|\+)./gu,
  field: 'Téléphone',
  fix: (toFix: string): string => toFix.replace(/(?!\w|\+)./gu, '')
};

const FIX_UNEXPECTED_PHONE_LIST: CleanOperation = {
  name: 'unexpected phone list',
  selector: /\d{10}\/\/?\d{10}/u,
  field: 'Téléphone',
  fix: (toFix: string): string => toFix.split('/')[0] ?? ''
};

const FIX_PHONE_WITHOUT_STARTING_0: CleanOperation = {
  name: 'phone without starting 0',
  selector: /^(?!0)[0-9]{9}$/u,
  field: 'Téléphone',
  fix: (toFix: string): string => `+33${toFix}`
};

const FIX_SHORT_CAF_PHONE: CleanOperation = {
  name: 'short CAF phone',
  selector: /3230/u,
  field: 'Téléphone',
  fix: (): string => '+33969322121'
};

const REMOVE_TOO_FEW_DIGITS_IN_PHONE: CleanOperation = {
  name: 'too few digits in phone',
  selector: /^.{0,9}$/u,
  field: 'Téléphone'
};

const REMOVE_TOO_MANY_DIGITS_IN_PHONE: CleanOperation = {
  name: 'too many digits in phone',
  selector: /^0.{10,}/u,
  field: 'Téléphone'
};

const REMOVE_EMAIL_STARTING_WITH_WWW: CleanOperation = {
  name: 'email starts with www.',
  selector: /^www\./u,
  field: 'Courriel'
};

const FIX_UNEXPECTED_EMAIL_LABEL: CleanOperation = {
  name: 'unexpected email label',
  selector: /\S\s:\s\S/u,
  field: 'Courriel',
  fix: (toFix: string): string => toFix.split(/\s:\s/u)[1] ?? ''
};

const FIX_UNEXPECTED_EMAIL_LIST: CleanOperation = {
  name: 'unexpected email list',
  selector: /\S\s?(?:et|ou|;|\s|\/)\s?\S/u,
  field: 'Courriel',
  fix: (toFix: string): string => toFix.split(/\s?(?:et|ou|;|\s|\/)\s?/u)[0] ?? ''
};

const FIX_MISSING_AT_IN_EMAIL: CleanOperation = {
  name: 'missing @ in email',
  selector: /\[a\]/gu,
  field: 'Courriel',
  fix: (toFix: string): string => toFix.replace('[a]', '@')
};

const FIX_MISSING_EMAIL_EXTENSION: CleanOperation = {
  name: 'missing dot suffix in email',
  selector: /\.[a-z]{2,3}$/u,
  field: 'Courriel',
  negate: true
};

export const CLEAN_OPERATIONS: CleanOperation[] = [
  REMOVE_HTTP_ONLY_WEBSITES,
  FIX_MISSING_HTTP_WEBSITES,
  FIX_UNEXPECTED_PHONE_LIST,
  FIX_HEADING_DETAILS_IN_PHONE,
  FIX_TRAILING_DETAILS_IN_PHONE,
  FIX_WRONG_CHARS_IN_PHONE,
  FIX_PHONE_WITHOUT_STARTING_0,
  FIX_SHORT_CAF_PHONE,
  REMOVE_TOO_FEW_DIGITS_IN_PHONE,
  REMOVE_TOO_MANY_DIGITS_IN_PHONE,
  REMOVE_EMAIL_STARTING_WITH_WWW,
  FIX_UNEXPECTED_EMAIL_LABEL,
  FIX_UNEXPECTED_EMAIL_LIST,
  FIX_MISSING_AT_IN_EMAIL,
  FIX_MISSING_EMAIL_EXTENSION
];
