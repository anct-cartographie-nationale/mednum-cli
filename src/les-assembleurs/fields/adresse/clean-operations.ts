/* eslint-disable @typescript-eslint/naming-convention,  @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */

import { LesAssembleursLieuMediationNumerique } from '../../helpers';
const communes: Commune[] = require('../../../../assets/data/communes.json');

type Commune = { Nom_commune: string; Code_postal: number };

export type CleanOperation = {
  name: string;
  selector: RegExp;
  field: 'Adresse' | 'Code postal' | 'Commune';
  negate?: boolean;
  fix?: (toFix: number | string, lesAssembleursLieuMediationNumerique?: LesAssembleursLieuMediationNumerique) => string;
};

const FIX_UNEXPECTED_DETAILS_IN_COMMUNE: CleanOperation = {
  name: 'unexpected details in commune',
  selector: /\s*\(.*\)\s*/u,
  field: 'Commune',
  fix: (toFix: number | string): string => toFix.toString().replace(/\s*\(.*\)\s*/u, '')
};

const FIX_WRONG_ACCENT_CHARS_IN_COMMUNE: CleanOperation = {
  name: 'replace ╢ with Â',
  selector: /╢/u,
  field: 'Commune',
  fix: (toFix: number | string): string => toFix.toString().replace('╢', 'Â')
};

const toCommuneName = (commune: Commune): string => commune.Nom_commune.toLowerCase();

const formatToCommuneNameData = (commune: string): string =>
  commune.toLowerCase().replace('saint', 'st').replace(/['-]/gu, ' ');

const formatCodePostal = (codePostal: string): string => (codePostal.length === 4 ? `0${codePostal}` : codePostal);

const ofMatchingCommuneName =
  (matchingCommuneName: string) =>
  (communeName: string): boolean =>
    communeName === formatToCommuneNameData(matchingCommuneName);

const findCodePostal = (matchingCommuneName: string): string =>
  communes[communes.map(toCommuneName).findIndex(ofMatchingCommuneName(matchingCommuneName))]?.Code_postal.toString() ?? '';

const codePostalFromCommune = (commune: string): string => formatCodePostal(findCodePostal(commune));

const processCodePostal = (lesAssembleursLieuMediationNumerique: LesAssembleursLieuMediationNumerique): string =>
  lesAssembleursLieuMediationNumerique['Code postal'].toString() === ''
    ? codePostalFromCommune(lesAssembleursLieuMediationNumerique.Commune)
    : lesAssembleursLieuMediationNumerique['Code postal'].toString();

const throwMissingFixRequiredDataError = (): string => {
  throw new Error('Missing fix required data');
};

const FIX_MISSING_CODE_POSTAL: CleanOperation = {
  name: 'missing code postal',
  selector: /^$/u,
  field: 'Code postal',
  fix: (_: number | string, lesAssembleursLieuMediationNumerique?: LesAssembleursLieuMediationNumerique): string =>
    lesAssembleursLieuMediationNumerique == null
      ? throwMissingFixRequiredDataError()
      : processCodePostal(lesAssembleursLieuMediationNumerique)
};

const FIX_MISSING_0_IN_CODE_POSTAL: CleanOperation = {
  name: 'missing 0 in code postal',
  selector: /^\d{4}$/u,
  field: 'Code postal',
  fix: (codePostal: number | string): string => `0${codePostal}`
};

export const CLEAN_OPERATIONS: CleanOperation[] = [
  FIX_UNEXPECTED_DETAILS_IN_COMMUNE,
  FIX_WRONG_ACCENT_CHARS_IN_COMMUNE,
  FIX_MISSING_0_IN_CODE_POSTAL,
  FIX_MISSING_CODE_POSTAL
];
