/* eslint-disable max-lines, max-lines-per-function, prefer-named-capture-group, no-control-regex */

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
  selector: /\n/u,
  field,
  fix: (toFix: string): string => toFix.replace(/\n/u, '')
});

const replaceDoubleDotBySingleDotInWebsites = (field: string): CleanOperation => ({
  name: ': instead of . after www',
  selector: /www:/gu,
  field,
  fix: (toFix: string): string => toFix.replace(/www:/gu, 'www.')
});

const removeWebsitesStartingWithAt = (field: string): CleanOperation => ({
  name: 'remove url starting by at',
  selector: /^@/u,
  field
});

const removeWebsitesWithAccentedCharacters = (field: string): CleanOperation => ({
  name: 'websites with accented characters',
  selector: /[^\x00-\x7F]+/gu,
  field
});

const removeMissingExtensionWebsites = (field: string): CleanOperation => ({
  name: 'missing extension websites',
  selector: /^.*(?<!\.\w+\/?)$/u,
  field
});

const fixMissingHttpWebsitesWithMultipleUrl = (field: string): CleanOperation => ({
  name: 'missing http websites with multiple url',
  selector: /\|((?!http[s]?:\/\/)[^|]+)/gu,
  field,
  fix: (toFix: string): string => toFix.replace(/\|((?!http[s]?:\/\/)[^|]+)/gu, '|http://$1')
});

const fixMissingHttpWebsites = (field: string): CleanOperation => ({
  name: 'missing http websites',
  selector: /^(?!http).*/u,
  field,
  fix: (toFix: string): string => `http://${toFix}`
});

const fixUppercaseWebsites = (field: string): CleanOperation => ({
  name: 'uppercase in websites',
  selector: /[A-Z]/u,
  field,
  fix: (toFix: string): string => toFix.toLowerCase()
});

const fixMisplacedColonInWebsite = (field: string): CleanOperation => ({
  name: 'missing colon websites',
  selector: /https\/\/:/u,
  field,
  fix: (toFix: string): string => toFix.replace(/https\/\/:/u, 'https://')
});

const fixMissingColonWebsites = (field: string): CleanOperation => ({
  name: 'missing colon websites',
  selector: /(https?)(\/\/)/u,
  field,
  fix: (toFix: string): string => toFix.replace(/(https?)(\/\/)/u, '$1:$2')
});

const fixMultipleUrlNotSeparatedWebsites = (field: string): CleanOperation => ({
  name: 'missing separator between url',
  selector: /(https?:\/\/[^|]+(?!\|))(https?:\/\/)/gu,
  field,
  fix: (toFix: string): string => toFix.replace(/(https?:\/\/[^|]+(?!\|))(https?:\/\/)/gu, '$1|$2')
});

const fixDuplicateHttpWebsites = (field: string): CleanOperation => ({
  name: 'duplicate http websites',
  selector: /^https?:\/\/https?:\/\/.*/u,
  field,
  fix: (toFix: string): string => toFix.replace(/^https?:\/\/https?:\/\//u, 'https://')
});

const fixWebsitesSeparator = (field: string): CleanOperation => ({
  name: 'websites separator',
  selector: /;|\s(?:ou|\/|;)\s/u,
  field,
  fix: (toFix: string): string => toFix.replace(/;|\s(?:ou|\/|;)\s/u, '|')
});

const fixWebsitesWithSingleSlash = (field: string): CleanOperation => ({
  name: 'website without colon and slash',
  selector: /^https?:\/www/u,
  field,
  fix: (toFix: string): string => toFix.replace(/:\/www/u, '://www')
});

const fixWebsitesWithoutColonAndSlash = (field: string): CleanOperation => ({
  name: 'website without colon and slash',
  selector: /^https?\/www/u,
  field,
  fix: (toFix: string): string => toFix.replace(/^https?\/www/u, 'https://www')
});

const fixWebsitesWithComaInsteadOfDot = (field: string): CleanOperation => ({
  name: 'website with coma instead of dot',
  selector: /^http:\/\/www,/u,
  field,
  fix: (toFix: string): string => toFix.replace(/^http:\/\/www,/u, 'http://www.')
});

const fixWebsitesWithMissingSlashAfterHttp = (field: string): CleanOperation => ({
  name: 'website with coma instead of dot',
  selector: /^http:\/[^/]/u,
  field,
  fix: (toFix: string): string => toFix.replace(/^http:\//u, 'http://')
});

const removeWebsitesWithSpaces = (field: string): CleanOperation => ({
  name: 'websites with spaces',
  selector: /\s/u,
  field
});

const fixWebsitesWithCodedSpacesAndParenthese = (field: string): CleanOperation => ({
  name: 'websites with coded spaces',
  selector: /[()]/gu,
  field,
  fix: (toFix: string): string => toFix.replace(/[()]/gu, (match: string): string => (match === '(' ? '%28' : '%29'))
});

const fixDetailsInParenthesisInPhone = (field: string): CleanOperation => ({
  name: 'trailing details in phone',
  selector: /\s\(.*\)$/gu,
  field,
  fix: (toFix: string): string => toFix.replace(/\s\(.*\)$/gu, '')
});

const fixHeadingDetailsInPhone = (field: string): CleanOperation => ({
  name: 'heading details in phone',
  selector: /^\D{3,}/gu,
  field,
  fix: (toFix: string): string => toFix.replace(/^\D{3,}/gu, '')
});

const fixTrailingDetailsInPhone = (field: string): CleanOperation => ({
  name: 'trailing details in phone',
  selector: /\s[A-Za-z].*$/gu,
  field,
  fix: (toFix: string): string => toFix.replace(/\s[A-Za-z].*$/gu, '')
});

const fixWrongCharsInPhone = (field: string): CleanOperation => ({
  name: 'wrong chars in phone',
  selector: /(?!\w|\+)./gu,
  field,
  fix: (toFix: string): string => toFix.replace(/(?!\w|\+)./gu, '')
});

const fixUnexpectedPhoneList = (field: string): CleanOperation => ({
  name: 'unexpected phone list',
  selector: /\d{10}\/\/?\d{10}/u,
  field,
  fix: (toFix: string): string => toFix.split('/')[0] ?? ''
});

const fixPhoneWithoutStarting0 = (field: string, codePostal?: string): CleanOperation => ({
  name: 'phone without starting 0',
  selector: /^[1-9]\d{8}$/u,
  field,
  fix: (toFix: string): string => setPhoneCodeWhenDomTom(codePostal) + toFix
});

const fixShortCafPhone = (field: string): CleanOperation => ({
  name: 'short CAF phone',
  selector: /3230/u,
  field,
  fix: (): string => '+33969322121'
});

const fixShortAssuranceRetraitePhone = (field: string): CleanOperation => ({
  name: 'short assurance retraite phone',
  selector: /3960/u,
  field,
  fix: (): string => '+33971103960'
});

const fixMissingPlusCharAtStartingPhone = (field: string): CleanOperation => ({
  name: 'fix missing + at starting phone number',
  selector: /^33(\d+)/u,
  field,
  fix: (toFix: string): string => toFix.replace(/^33(\d+)/u, '+33$1')
});

const removeTooFewDigitsInPhone = (field: string): CleanOperation => ({
  name: 'too few digits in phone',
  selector: /^.{0,9}$/u,
  field
});

const removeTooManyDigitsInPhone = (field: string): CleanOperation => ({
  name: 'too many digits in phone',
  selector: /^0.{10,}/u,
  field
});

const removeOnly0ValueInPhone = (field: string): CleanOperation => ({
  name: 'fake number in phone',
  selector: /^0{10}$/u,
  field
});

const removeNoValidNumbersInPhone = (field: string): CleanOperation => ({
  name: 'fake number in phone',
  selector: /^[1-9]\d{9}$/u,
  field
});

const removeStartingByTwoZeroInPhone = (field: string): CleanOperation => ({
  name: 'fake number in phone',
  selector: /^00.+/u,
  field
});

const keepFirstNumberIfMultiple = (field: string): CleanOperation => ({
  name: 'keep only the first phone number',
  selector: /\n/u,
  field,
  fix: (toFix: string): string => /^(?<phone>[^\n]+)/u.exec(toFix)?.groups?.['phone'] ?? ''
});

const fixSpaceBeforeDotInEmail = (field: string): CleanOperation => ({
  name: 'remove space before dot.',
  selector: /\w\s\./u,
  field,
  fix: (toFix: string): string => toFix.replace(/(\w)\s\./u, '$1.')
});

const fixSpaceInEmail = (field: string): CleanOperation => ({
  name: 'remove space in email.',
  selector: /^\w+@\w+\s\w+\.\w+$/u,
  field,
  fix: (toFix: string): string => toFix.replace(/\s/u, '')
});

const removeTextPrecededByWrongCharacterInEmail = (field: string): CleanOperation => ({
  name: 'text preceded by wrong wharacter',
  selector: /^\w+[;\s]/u,
  field,
  fix: (toFix: string): string => toFix.replace(/^\w+[;\s]/u, '')
});

const removeEmailStartingWithWww = (field: string): CleanOperation => ({
  name: 'email starts with www.',
  selector: /^www\./u,
  field
});

const removeEmailStartingWithAt = (field: string): CleanOperation => ({
  name: 'email starts with @',
  selector: /^@/u,
  field
});

const fixEmailWithTwoArobase = (field: string): CleanOperation => ({
  name: 'email with two @',
  selector: /@@/u,
  field,
  fix: (toFix: string): string => toFix.replace(/@@/u, '@')
});

const trimEmail = (field: string): CleanOperation => ({
  name: 'email starts with mailto:',
  selector: /^\s+|\s+$/u,
  field,
  fix: (toFix: string): string => toFix.trim()
});

const fixEmailStartingWithMailToOrColon = (field: string): CleanOperation => ({
  name: 'email starts with mailto: or colon',
  selector: /^mailto:|:/u,
  field,
  fix: (toFix: string): string => toFix.replace(/^mailto:|:/u, '')
});

const fixUnexpectedEmailLabel = (field: string): CleanOperation => ({
  name: 'unexpected email label',
  selector: /\S\s:\s\S/u,
  field,
  fix: (toFix: string): string => toFix.split(/\s:\s/u)[1] ?? ''
});

const fixStartingWithDotEmail = (field: string): CleanOperation => ({
  name: 'email starting with dot',
  selector: /^\.([^@]+)@/u,
  field,
  fix: (toFix: string): string => toFix.replace(/^\.([^@]+)@/u, '$1@')
});

const fixUnexpectedEmailSeparator = (field: string): CleanOperation => ({
  name: 'unexpected email separator',
  selector: /\S\s?(?:et|ou|;|\s|\/)\s?\S/u,
  field,
  fix: (toFix: string): string => toFix.replace(/\s?(?:et|ou|;|\s|\/)\s?/gu, '|')
});

const fixObfuscatedAtInEmail = (field: string): CleanOperation => ({
  name: 'obfuscated @ in email',
  selector: /\[a\]/gu,
  field,
  fix: (toFix: string): string => toFix.replace('[a]', '@')
});

const removeMissingAtInEmail = (field: string): CleanOperation => ({
  name: 'missing @ in email',
  selector: /^[^@]+$/gu,
  field
});

const fixMissingEmailExtension = (field: string): CleanOperation => ({
  name: 'missing dot suffix in email',
  selector: /\.[a-z]{2,3}$/u,
  field,
  negate: true
});

const removeDashEmail = (field: string): CleanOperation => ({
  name: 'dash email',
  selector: /^-+$/u,
  field
});

const removeMultipleAtEmail = (field: string): CleanOperation => ({
  name: 'multiple at',
  selector: /@.+@/u,
  field
});

const fixMissingAccentuatedEInEmail = (field: string): CleanOperation => ({
  name: 'fix accentuated chars',
  selector: /[éè]/u,
  field,
  fix: (toFix: string): string => toFix.replace(/[éè]/gu, 'e')
});

const fixMissingAccentuatedCInEmail = (field: string): CleanOperation => ({
  name: 'fix accentuated chars',
  selector: /ç/u,
  field,
  fix: (toFix: string): string => toFix.replace(/ç/gu, 'c')
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
