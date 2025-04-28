import { LieuxMediationNumeriqueMatching } from '../../input';

export type CleanOperation = {
  name: string;
  selector: RegExp;
  field: string;
  negate?: boolean;
  fix?: (toFix: string) => string;
};

const setPhoneCodeWhenDomTom = (codePostal?: string): string => {
  const codePost: string = codePostal?.toString()?.slice(0, 3) ?? '';
  switch (codePost) {
    case '971':
      return '+590';
    case '972':
      return '+596';
    case '973':
      return '+594';
    case '974':
      return '+262';
    default:
      return '+33';
  }
};

const replaceNewlineInWebsites = (field: string): CleanOperation => ({
  name: 'replace newline in websites',
  selector: /\n/,
  field,
  fix: (toFix: string): string => toFix.replace(/\n/, '')
});

const replaceDoubleDotBySingleDotInWebsites = (field: string): CleanOperation => ({
  name: ': instead of . after www',
  selector: /www:/g,
  field,
  fix: (toFix: string): string => toFix.replace(/www:/g, 'www.')
});

const removeWebsitesStartingWithAt = (field: string): CleanOperation => ({
  name: 'remove url starting by at',
  selector: /^@/,
  field
});

const removeWebsitesWithAccentedCharacters = (field: string): CleanOperation => ({
  name: 'websites with accented characters',
  // eslint-disable-next-line no-control-regex
  selector: /[^\x00-\x7F]+/g,
  field
});

const removeMissingExtensionWebsites = (field: string): CleanOperation => ({
  name: 'missing extension websites',
  selector: /^.*(?<!\.\w+\/?)$/,
  field
});

const fixMissingHttpWebsitesWithMultipleUrl = (field: string): CleanOperation => ({
  name: 'missing http websites with multiple url',
  selector: /\|((?!http[s]?:\/\/)[^|]+)/g,
  field,
  fix: (toFix: string): string => toFix.replace(/\|((?!http[s]?:\/\/)[^|]+)/g, '|http://$1')
});

const fixMissingHttpWebsites = (field: string): CleanOperation => ({
  name: 'missing http websites',
  selector: /^(?!http).*/,
  field,
  fix: (toFix: string): string => `http://${toFix}`
});

const fixUppercaseWebsites = (field: string): CleanOperation => ({
  name: 'uppercase in websites',
  selector: /[A-Z]/,
  field,
  fix: (toFix: string): string => toFix.toLowerCase()
});

const fixMisplacedColonInWebsite = (field: string): CleanOperation => ({
  name: 'missing colon websites',
  selector: /https\/\/:/,
  field,
  fix: (toFix: string): string => toFix.replace(/https\/\/:/, 'https://')
});

const fixMissingColonWebsites = (field: string): CleanOperation => ({
  name: 'missing colon websites',
  selector: /(https?)(\/\/)/,
  field,
  fix: (toFix: string): string => toFix.replace(/(https?)(\/\/)/, '$1:$2')
});

const fixMultipleUrlNotSeparatedWebsites = (field: string): CleanOperation => ({
  name: 'missing separator between url',
  selector: /(https?:\/\/[^|]+(?!\|))(https?:\/\/)/g,
  field,
  fix: (toFix: string): string => toFix.replace(/(https?:\/\/[^|]+(?!\|))(https?:\/\/)/g, '$1|$2')
});

const fixDuplicateHttpWebsites = (field: string): CleanOperation => ({
  name: 'duplicate http websites',
  selector: /^https?:\/\/https?:\/\/.*/,
  field,
  fix: (toFix: string): string => toFix.replace(/^https?:\/\/https?:\/\//, 'https://')
});

const fixWebsitesSeparator = (field: string): CleanOperation => ({
  name: 'websites separator',
  selector: /;|\s(?:ou|\/|;)\s/,
  field,
  fix: (toFix: string): string => toFix.replace(/;|\s(?:ou|\/|;)\s/, '|')
});

const fixWebsitesWithSingleSlash = (field: string): CleanOperation => ({
  name: 'website without colon and slash',
  selector: /^https?:\/[a-zA-Z0-9]/,
  field,
  fix: (toFix: string): string => toFix.replace(/:\/([a-zA-Z0-9])/, '://$1')
});

const fixWebsitesWithoutColonAndSlash = (field: string): CleanOperation => ({
  name: 'website without colon and slash',
  selector: /^https?\/www/,
  field,
  fix: (toFix: string): string => toFix.replace(/^https?\/www/, 'https://www')
});

const fixWebsitesWithComaInsteadOfDot = (field: string): CleanOperation => ({
  name: 'website with coma instead of dot',
  selector: /^http:\/\/www,/,
  field,
  fix: (toFix: string): string => toFix.replace(/^http:\/\/www,/, 'http://www.')
});

const fixWebsitesWithMissingSlashAfterHttp = (field: string): CleanOperation => ({
  name: 'website with coma instead of dot',
  selector: /^http:\/[^/]/,
  field,
  fix: (toFix: string): string => toFix.replace(/^http:\//, 'http://')
});

const removeWebsitesWithSpaces = (field: string): CleanOperation => ({
  name: 'websites with spaces',
  selector: /\s/,
  field
});

const fixWebsitesWithCodedSpacesAndParenthese = (field: string): CleanOperation => ({
  name: 'websites with coded spaces',
  selector: /[()]/g,
  field,
  fix: (toFix: string): string => toFix.replace(/[()]/g, (match: string): string => (match === '(' ? '%28' : '%29'))
});

const fixDetailsInParenthesisInPhone = (field: string): CleanOperation => ({
  name: 'trailing details in phone',
  selector: /\s\(.*\)$/g,
  field,
  fix: (toFix: string): string => toFix.replace(/\s\(.*\)$/g, '')
});

const fixHeadingDetailsInPhone = (field: string): CleanOperation => ({
  name: 'heading details in phone',
  selector: /^\D{3,}/g,
  field,
  fix: (toFix: string): string => toFix.replace(/^\D{3,}/g, '')
});

const fixTrailingDetailsInPhone = (field: string): CleanOperation => ({
  name: 'trailing details in phone',
  selector: /\s[A-Za-z].*$/g,
  field,
  fix: (toFix: string): string => toFix.replace(/\s[A-Za-z].*$/g, '')
});

const fixWrongCharsInPhone = (field: string): CleanOperation => ({
  name: 'wrong chars in phone',
  selector: /(?!\w|\+)./g,
  field,
  fix: (toFix: string): string => toFix.replace(/(?!\w|\+)./g, '')
});

const fixUnexpectedPhoneList = (field: string): CleanOperation => ({
  name: 'unexpected phone list',
  selector: /\d{10}\/\/?\d{10}/,
  field,
  fix: (toFix: string): string => toFix.split('/')[0] ?? ''
});

const fixPhoneWithoutStarting0 = (field: string, codePostal?: string): CleanOperation => ({
  name: 'phone without starting 0',
  selector: /^[1-9]\d{8}$/,
  field,
  fix: (toFix: string): string => setPhoneCodeWhenDomTom(codePostal) + toFix
});

const fixShortCafPhone = (field: string): CleanOperation => ({
  name: 'short CAF phone',
  selector: /3230/,
  field,
  fix: (): string => '+33969322121'
});

const fixShortAssuranceRetraitePhone = (field: string): CleanOperation => ({
  name: 'short assurance retraite phone',
  selector: /3960/,
  field,
  fix: (): string => '+33971103960'
});

const fixMissingPlusCharAtStartingPhone = (field: string): CleanOperation => ({
  name: 'fix missing + at starting phone number',
  selector: /^(33|262|590|594|596)(\d+)/,
  field,
  fix: (toFix: string): string => toFix.replace(/^(33|262|590|594|596)(\d+)/, '+$1$2')
});

const fixReplaceLeading0With33InPhoneNumberStatingWithPlus = (field: string): CleanOperation => ({
  name: 'fix missing + at starting phone number',
  selector: /^\+0(\d{9})/,
  field,
  fix: (toFix: string): string => toFix.replace(/^\+0(\d{9})/, '+33$1')
});

const removeTooFewDigitsInPhone = (field: string): CleanOperation => ({
  name: 'too few digits in phone',
  selector: /^.{0,9}$/,
  field
});

const removeTooManyDigitsInPhone = (field: string): CleanOperation => ({
  name: 'too many digits in phone',
  selector: /^0.{10,}/,
  field
});

const removeOnly0ValueInPhone = (field: string): CleanOperation => ({
  name: 'fake number in phone',
  selector: /^0{10}$/,
  field
});

const removeNoValidNumbersInPhone = (field: string): CleanOperation => ({
  name: 'fake number in phone',
  selector: /^[1-9]\d{9}$/,
  field
});

const removeStartingByTwoZeroInPhone = (field: string): CleanOperation => ({
  name: 'fake number in phone',
  selector: /^00.+/,
  field
});

const keepFirstNumberIfMultiple = (field: string): CleanOperation => ({
  name: 'keep only the first phone number',
  selector: /\n/,
  field,
  fix: (toFix: string): string => /^(?<phone>[^\n]+)/u.exec(toFix)?.groups?.['phone'] ?? ''
});

const fixSpaceBeforeDotInEmail = (field: string): CleanOperation => ({
  name: 'remove space before dot.',
  selector: /\w\s\./,
  field,
  fix: (toFix: string): string => toFix.replace(/(\w)\s\./, '$1.')
});

const fixSpaceInEmail = (field: string): CleanOperation => ({
  name: 'remove space in email.',
  selector: /^\w+@\w+\s\w+\.\w+$/,
  field,
  fix: (toFix: string): string => toFix.replace(/\s/, '')
});

const removeTextPrecededByWrongCharacterInEmail = (field: string): CleanOperation => ({
  name: 'text preceded by wrong wharacter',
  selector: /^\w+[;\s]/,
  field,
  fix: (toFix: string): string => toFix.replace(/^\w+[;\s]/, '')
});

const removeEmailStartingWithWww = (field: string): CleanOperation => ({
  name: 'email starts with www.',
  selector: /^www\./,
  field
});

const removeEmailStartingWithAt = (field: string): CleanOperation => ({
  name: 'email starts with @',
  selector: /^@/,
  field
});

const fixEmailWithTwoArobase = (field: string): CleanOperation => ({
  name: 'email with two @',
  selector: /@@/,
  field,
  fix: (toFix: string): string => toFix.replace(/@@/, '@')
});

const trimEmail = (field: string): CleanOperation => ({
  name: 'email starts with mailto:',
  selector: /^\s+|\s+$/,
  field,
  fix: (toFix: string): string => toFix.trim()
});

const fixEmailStartingWithMailToOrColon = (field: string): CleanOperation => ({
  name: 'email starts with mailto: or colon',
  selector: /^mailto:|:/,
  field,
  fix: (toFix: string): string => toFix.replace(/^mailto:|:/, '')
});

const fixUnexpectedEmailLabel = (field: string): CleanOperation => ({
  name: 'unexpected email label',
  selector: /\S\s:\s\S/,
  field,
  fix: (toFix: string): string => toFix.split(/\s:\s/)[1] ?? ''
});

const fixStartingWithDotEmail = (field: string): CleanOperation => ({
  name: 'email starting with dot',
  selector: /^\.([^@]+)@/,
  field,
  fix: (toFix: string): string => toFix.replace(/^\.([^@]+)@/, '$1@')
});

const fixUnexpectedEmailSeparator = (field: string): CleanOperation => ({
  name: 'unexpected email separator',
  selector: /\S\s?(?:et|ou|;|\s|\/)\s?\S/,
  field,
  fix: (toFix: string): string => toFix.replace(/\s?(?:et|ou|;|\s|\/)\s?/g, '|')
});

const fixObfuscatedAtInEmail = (field: string): CleanOperation => ({
  name: 'obfuscated @ in email',
  selector: /\[a\]/g,
  field,
  fix: (toFix: string): string => toFix.replace('[a]', '@')
});

const removeMissingAtInEmail = (field: string): CleanOperation => ({
  name: 'missing @ in email',
  selector: /^[^@]+$/g,
  field
});

const fixMissingEmailExtension = (field: string): CleanOperation => ({
  name: 'missing dot suffix in email',
  selector: /\.[a-z]{2,3}$/,
  field,
  negate: true
});

const removeDashEmail = (field: string): CleanOperation => ({
  name: 'dash email',
  selector: /^-+$/,
  field
});

const removeMultipleAtEmail = (field: string): CleanOperation => ({
  name: 'multiple at',
  selector: /@.+@/,
  field
});

const fixMissingAccentuatedEInEmail = (field: string): CleanOperation => ({
  name: 'fix accentuated chars',
  selector: /[éè]/,
  field,
  fix: (toFix: string): string => toFix.replace(/[éè]/g, 'e')
});

const fixMissingAccentuatedCInEmail = (field: string): CleanOperation => ({
  name: 'fix accentuated chars',
  selector: /ç/,
  field,
  fix: (toFix: string): string => toFix.replace(/ç/g, 'c')
});

const cleanOperationIfAny = (
  cleanOperator: (colonne: string, codePostal?: string) => CleanOperation,
  colonne?: string,
  codePostal?: string
): CleanOperation[] => (colonne == null ? [] : [cleanOperator(colonne, codePostal)]);

export const cleanOperations = (
  matching: LieuxMediationNumeriqueMatching,
  codePostal: string | undefined
): CleanOperation[] => [
  ...cleanOperationIfAny(replaceNewlineInWebsites, matching.site_web?.colonne),
  ...cleanOperationIfAny(replaceDoubleDotBySingleDotInWebsites, matching.site_web?.colonne),
  ...cleanOperationIfAny(removeWebsitesStartingWithAt, matching.site_web?.colonne),
  ...cleanOperationIfAny(fixWebsitesSeparator, matching.site_web?.colonne),
  ...cleanOperationIfAny(fixDuplicateHttpWebsites, matching.site_web?.colonne),
  ...cleanOperationIfAny(fixUppercaseWebsites, matching.site_web?.colonne),
  ...cleanOperationIfAny(fixMultipleUrlNotSeparatedWebsites, matching.site_web?.colonne),
  ...cleanOperationIfAny(removeWebsitesWithAccentedCharacters, matching.site_web?.colonne),
  ...cleanOperationIfAny(removeMissingExtensionWebsites, matching.site_web?.colonne),
  ...cleanOperationIfAny(fixWebsitesWithSingleSlash, matching.site_web?.colonne),
  ...cleanOperationIfAny(fixWebsitesWithoutColonAndSlash, matching.site_web?.colonne),
  ...cleanOperationIfAny(fixWebsitesWithComaInsteadOfDot, matching.site_web?.colonne),
  ...cleanOperationIfAny(fixWebsitesWithMissingSlashAfterHttp, matching.site_web?.colonne),
  ...cleanOperationIfAny(removeWebsitesWithSpaces, matching.site_web?.colonne),
  ...cleanOperationIfAny(fixWebsitesWithCodedSpacesAndParenthese, matching.site_web?.colonne),
  ...cleanOperationIfAny(fixMissingHttpWebsites, matching.site_web?.colonne),
  ...cleanOperationIfAny(fixMissingHttpWebsitesWithMultipleUrl, matching.site_web?.colonne),
  ...cleanOperationIfAny(fixMisplacedColonInWebsite, matching.site_web?.colonne),
  ...cleanOperationIfAny(fixMissingColonWebsites, matching.site_web?.colonne),
  ...cleanOperationIfAny(removeStartingByTwoZeroInPhone, matching.telephone?.colonne),
  ...cleanOperationIfAny(removeNoValidNumbersInPhone, matching.telephone?.colonne),
  ...cleanOperationIfAny(fixUnexpectedPhoneList, matching.telephone?.colonne),
  ...cleanOperationIfAny(fixDetailsInParenthesisInPhone, matching.telephone?.colonne),
  ...cleanOperationIfAny(fixHeadingDetailsInPhone, matching.telephone?.colonne),
  ...cleanOperationIfAny(fixTrailingDetailsInPhone, matching.telephone?.colonne),
  ...cleanOperationIfAny(fixWrongCharsInPhone, matching.telephone?.colonne),
  ...cleanOperationIfAny(fixPhoneWithoutStarting0, matching.telephone?.colonne, codePostal),
  ...cleanOperationIfAny(fixShortCafPhone, matching.telephone?.colonne),
  ...cleanOperationIfAny(removeDashEmail, matching.courriels?.colonne),
  ...cleanOperationIfAny(fixShortAssuranceRetraitePhone, matching.telephone?.colonne),
  ...cleanOperationIfAny(removeTooFewDigitsInPhone, matching.telephone?.colonne),
  ...cleanOperationIfAny(removeTooManyDigitsInPhone, matching.telephone?.colonne),
  ...cleanOperationIfAny(removeOnly0ValueInPhone, matching.telephone?.colonne),
  ...cleanOperationIfAny(keepFirstNumberIfMultiple, matching.telephone?.colonne),
  ...cleanOperationIfAny(fixMissingPlusCharAtStartingPhone, matching.telephone?.colonne),
  ...cleanOperationIfAny(fixReplaceLeading0With33InPhoneNumberStatingWithPlus, matching.telephone?.colonne),
  ...cleanOperationIfAny(fixSpaceBeforeDotInEmail, matching.courriels?.colonne),
  ...cleanOperationIfAny(fixSpaceInEmail, matching.courriels?.colonne),
  ...cleanOperationIfAny(removeEmailStartingWithWww, matching.courriels?.colonne),
  ...cleanOperationIfAny(removeEmailStartingWithAt, matching.courriels?.colonne),
  ...cleanOperationIfAny(trimEmail, matching.courriels?.colonne),
  ...cleanOperationIfAny(fixMissingAccentuatedEInEmail, matching.courriels?.colonne),
  ...cleanOperationIfAny(fixMissingAccentuatedCInEmail, matching.courriels?.colonne),
  ...cleanOperationIfAny(fixEmailWithTwoArobase, matching.courriels?.colonne),
  ...cleanOperationIfAny(fixStartingWithDotEmail, matching.courriels?.colonne),
  ...cleanOperationIfAny(fixEmailStartingWithMailToOrColon, matching.courriels?.colonne),
  ...cleanOperationIfAny(fixUnexpectedEmailLabel, matching.courriels?.colonne),
  ...cleanOperationIfAny(removeTextPrecededByWrongCharacterInEmail, matching.courriels?.colonne),
  ...cleanOperationIfAny(fixUnexpectedEmailSeparator, matching.courriels?.colonne),
  ...cleanOperationIfAny(fixObfuscatedAtInEmail, matching.courriels?.colonne),
  ...cleanOperationIfAny(fixMissingEmailExtension, matching.courriels?.colonne),
  ...cleanOperationIfAny(removeMissingAtInEmail, matching.courriels?.colonne),
  ...cleanOperationIfAny(removeMultipleAtEmail, matching.courriels?.colonne)
];
