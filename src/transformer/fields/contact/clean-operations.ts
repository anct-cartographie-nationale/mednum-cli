/* eslint-disable max-lines, max-lines-per-function */

import { LieuxMediationNumeriqueMatching } from '../../input';

export type CleanOperation = {
  name: string;
  selector: RegExp;
  field: string;
  negate?: boolean;
  fix?: (toFix: string) => string;
};

const removeHttpOnlyWebsites = (field: string): CleanOperation => ({
  name: 'http only websites',
  selector: /^http:\/\/$/u,
  field
});

const removeWebsitesWithAccentedCharacters = (field: string): CleanOperation => ({
  name: 'websites with accented characters',
  selector: /é/gu,
  field
});

const removeMissingExtensionWebsites = (field: string): CleanOperation => ({
  name: 'missing extension websites',
  selector: /^.*(?<!\.\w+\/?)$/u,
  field
});

const fixMissingHttpWebsites = (field: string): CleanOperation => ({
  name: 'missing http websites',
  selector: /^(?!http).*/u,
  field,
  fix: (toFix: string): string => `http://${toFix}`
});

const fixDuplicateHttpWebsites = (field: string): CleanOperation => ({
  name: 'duplicate http websites',
  selector: /^https?:\/\/https?:\/\/.*/u,
  field,
  fix: (toFix: string): string => toFix.replace(/^https?:\/\/https?:\/\//u, 'https://')
});

const fixMultipleWebsitesSeparator = (field: string): CleanOperation => ({
  name: 'multipe websites separator',
  selector: /^.*\s(?:ou|\/)\s.*$/u,
  field,
  fix: (toFix: string): string => toFix.replace(/\s(?:ou|\/)\s/u, ';')
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

const fixPhoneWithoutStarting0 = (field: string): CleanOperation => ({
  name: 'phone without starting 0',
  selector: /^[1-9]\d{8}$/u,
  field,
  fix: (toFix: string): string => `+33${toFix}`
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

const trimEmail = (field: string): CleanOperation => ({
  name: 'email starts with mailto:',
  selector: /^\s+|\s+$/u,
  field,
  fix: (toFix: string): string => toFix.trim()
});

const fixEmailStartingWithMailTo = (field: string): CleanOperation => ({
  name: 'email starts with mailto:',
  selector: /^mailto:/u,
  field,
  fix: (toFix: string): string => toFix.replace('mailto:', '')
});

const fixUnexpectedEmailLabel = (field: string): CleanOperation => ({
  name: 'unexpected email label',
  selector: /\S\s:\s\S/u,
  field,
  fix: (toFix: string): string => toFix.split(/\s:\s/u)[1] ?? ''
});

const fixUnexpectedEmailList = (field: string): CleanOperation => ({
  name: 'unexpected email list',
  selector: /\S\s?(?:et|ou|;|\s|\/)\s?\S/u,
  field,
  fix: (toFix: string): string => toFix.split(/\s?(?:et|ou|;|\s|\/)\s?/u)[0] ?? ''
});

const fixMissingAtInEmail = (field: string): CleanOperation => ({
  name: 'missing @ in email',
  selector: /\[a\]/gu,
  field,
  fix: (toFix: string): string => toFix.replace('[a]', '@')
});

const fixMissingEmailExtension = (field: string): CleanOperation => ({
  name: 'missing dot suffix in email',
  selector: /\.[a-z]{2,3}$/u,
  field,
  negate: true
});

const removeDashEmail = (field: string): CleanOperation => ({
  name: 'dash email',
  selector: /^-----$/u,
  field
});

const cleanOperationIfAny = (cleanOperator: (colonne: string) => CleanOperation, colonne?: string): CleanOperation[] =>
  colonne == null ? [] : [cleanOperator(colonne)];

export const cleanOperations = (matching: LieuxMediationNumeriqueMatching): CleanOperation[] => [
  ...cleanOperationIfAny(removeDashEmail, matching.courriel?.colonne),
  ...cleanOperationIfAny(removeHttpOnlyWebsites, matching.site_web?.colonne),
  ...cleanOperationIfAny(removeWebsitesWithAccentedCharacters, matching.site_web?.colonne),
  ...cleanOperationIfAny(removeMissingExtensionWebsites, matching.site_web?.colonne),
  ...cleanOperationIfAny(fixMissingHttpWebsites, matching.site_web?.colonne),
  ...cleanOperationIfAny(fixDuplicateHttpWebsites, matching.site_web?.colonne),
  ...cleanOperationIfAny(fixMultipleWebsitesSeparator, matching.site_web?.colonne),
  ...cleanOperationIfAny(fixWebsitesWithComaInsteadOfDot, matching.site_web?.colonne),
  ...cleanOperationIfAny(fixWebsitesWithMissingSlashAfterHttp, matching.site_web?.colonne),
  ...cleanOperationIfAny(removeWebsitesWithSpaces, matching.site_web?.colonne),
  ...cleanOperationIfAny(fixUnexpectedPhoneList, matching.telephone?.colonne),
  ...cleanOperationIfAny(fixDetailsInParenthesisInPhone, matching.telephone?.colonne),
  ...cleanOperationIfAny(fixHeadingDetailsInPhone, matching.telephone?.colonne),
  ...cleanOperationIfAny(fixTrailingDetailsInPhone, matching.telephone?.colonne),
  ...cleanOperationIfAny(fixWrongCharsInPhone, matching.telephone?.colonne),
  ...cleanOperationIfAny(fixPhoneWithoutStarting0, matching.telephone?.colonne),
  ...cleanOperationIfAny(fixShortCafPhone, matching.telephone?.colonne),
  ...cleanOperationIfAny(fixShortAssuranceRetraitePhone, matching.telephone?.colonne),
  ...cleanOperationIfAny(removeTooFewDigitsInPhone, matching.telephone?.colonne),
  ...cleanOperationIfAny(removeTooManyDigitsInPhone, matching.telephone?.colonne),
  ...cleanOperationIfAny(removeEmailStartingWithWww, matching.courriel?.colonne),
  ...cleanOperationIfAny(removeEmailStartingWithAt, matching.courriel?.colonne),
  ...cleanOperationIfAny(trimEmail, matching.courriel?.colonne),
  ...cleanOperationIfAny(fixEmailStartingWithMailTo, matching.courriel?.colonne),
  ...cleanOperationIfAny(fixUnexpectedEmailLabel, matching.courriel?.colonne),
  ...cleanOperationIfAny(fixUnexpectedEmailList, matching.courriel?.colonne),
  ...cleanOperationIfAny(fixMissingAtInEmail, matching.courriel?.colonne),
  ...cleanOperationIfAny(fixMissingEmailExtension, matching.courriel?.colonne)
];