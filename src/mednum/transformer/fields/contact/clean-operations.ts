/* eslint-disable max-lines */

import { LieuxMediationNumeriqueMatching } from '../../input';

export type CleanOperation = {
  name: string;
  selector: RegExp;
  field: string;
  negate?: boolean;
  fix?: (toFix: string) => string;
};

const removeHttpOnlyWebsites = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'http only websites',
  selector: /^http:\/\/$/u,
  field: matching.site_web.colonne
});

const removeMissingExtensionWebsites = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'missing extension websites',
  selector: /^.*(?<!\.\w+\/?)$/u,
  field: matching.site_web.colonne
});

const fixMissingHttpWebsites = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'missing http websites',
  selector: /^(?!http).*/u,
  field: matching.site_web.colonne,
  fix: (toFix: string): string => `http://${toFix}`
});

const fixDuplicateHttpWebsites = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'duplicate http websites',
  selector: /^https?:\/\/https?:\/\/.*/u,
  field: matching.site_web.colonne,
  fix: (toFix: string): string => toFix.replace(/^https?:\/\/https?:\/\//u, 'https://')
});

const fixMultipleWebsitesSeparator = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'multipe websites separator',
  selector: /^.*\s(?:ou|\/)\s.*$/u,
  field: matching.site_web.colonne,
  fix: (toFix: string): string => toFix.replace(/\s(?:ou|\/)\s/u, ';')
});

const removeWebsitesWithSpaces = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'websites with spaces',
  selector: /\s/u,
  field: matching.site_web.colonne
});

const fixHeadingDetailsInPhone = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'heading details in phone',
  selector: /^\D{3,}/gu,
  field: matching.telephone.colonne,
  fix: (toFix: string): string => toFix.replace(/^\D{3,}/gu, '')
});

const fixTrailingDetailsInPhone = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'trailing details in phone',
  selector: /\s[A-Za-z].*$/gu,
  field: matching.telephone.colonne,
  fix: (toFix: string): string => toFix.replace(/\s[A-Za-z].*$/gu, '')
});

const fixWrongCharsInPhone = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'wrong chars in phone',
  selector: /(?!\w|\+)./gu,
  field: matching.telephone.colonne,
  fix: (toFix: string): string => toFix.replace(/(?!\w|\+)./gu, '')
});

const fixUnexpectedPhoneList = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'unexpected phone list',
  selector: /\d{10}\/\/?\d{10}/u,
  field: matching.telephone.colonne,
  fix: (toFix: string): string => toFix.split('/')[0] ?? ''
});

const fixPhoneWithoutStarting0 = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'phone without starting 0',
  selector: /^[1-9]\d{8}$/u,
  field: matching.telephone.colonne,
  fix: (toFix: string): string => `+33${toFix}`
});

const fixShortCafPhone = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'short CAF phone',
  selector: /3230/u,
  field: matching.telephone.colonne,
  fix: (): string => '+33969322121'
});

const removeTooFewDigitsInPhone = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'too few digits in phone',
  selector: /^.{0,9}$/u,
  field: matching.telephone.colonne
});

const removeTooManyDigitsInPhone = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'too many digits in phone',
  selector: /^0.{10,}/u,
  field: matching.telephone.colonne
});

const removeEmailStartingWithWww = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'email starts with www.',
  selector: /^www\./u,
  field: matching.courriel.colonne
});

const fixUnexpectedEmailLabel = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'unexpected email label',
  selector: /\S\s:\s\S/u,
  field: matching.courriel.colonne,
  fix: (toFix: string): string => toFix.split(/\s:\s/u)[1] ?? ''
});

const fixUnexpectedEmailList = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'unexpected email list',
  selector: /\S\s?(?:et|ou|;|\s|\/)\s?\S/u,
  field: matching.courriel.colonne,
  fix: (toFix: string): string => toFix.split(/\s?(?:et|ou|;|\s|\/)\s?/u)[0] ?? ''
});

const fixMissingAtInEmail = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'missing @ in email',
  selector: /\[a\]/gu,
  field: matching.courriel.colonne,
  fix: (toFix: string): string => toFix.replace('[a]', '@')
});

const fixMissingEmailExtension = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'missing dot suffix in email',
  selector: /\.[a-z]{2,3}$/u,
  field: matching.courriel.colonne,
  negate: true
});

export const cleanOperations = (matching: LieuxMediationNumeriqueMatching): CleanOperation[] => [
  removeHttpOnlyWebsites(matching),
  removeMissingExtensionWebsites(matching),
  fixMissingHttpWebsites(matching),
  fixDuplicateHttpWebsites(matching),
  fixMultipleWebsitesSeparator(matching),
  removeWebsitesWithSpaces(matching),
  fixUnexpectedPhoneList(matching),
  fixHeadingDetailsInPhone(matching),
  fixTrailingDetailsInPhone(matching),
  fixWrongCharsInPhone(matching),
  fixPhoneWithoutStarting0(matching),
  fixShortCafPhone(matching),
  removeTooFewDigitsInPhone(matching),
  removeTooManyDigitsInPhone(matching),
  removeEmailStartingWithWww(matching),
  fixUnexpectedEmailLabel(matching),
  fixUnexpectedEmailList(matching),
  fixMissingAtInEmail(matching),
  fixMissingEmailExtension(matching)
];
