/* eslint-disable @typescript-eslint/naming-convention,  @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */

import { processCodePostal, throwMissingFixRequiredDataError } from '../../../tools';
import { MaineEtLoireLieuMediationNumerique } from '../../helper';

export type CleanOperation = {
  name: string;
  selector: RegExp;
  field: 'Adresse' | 'CP' | 'Commune';
  negate?: boolean;
  fix?: (toFix: string, maineEtLoireLieuMediationNumerique?: MaineEtLoireLieuMediationNumerique) => string;
};

const FIX_WRONG_ACCENT_CHARS_IN_COMMUNE: CleanOperation = {
  name: 'replace ╢ with Â',
  selector: /╢/u,
  field: 'Commune',
  fix: (toFix: string): string => toFix.replace('╢', 'Â')
};

const FIX_UNEXPECTED_DETAILS_IN_COMMUNE: CleanOperation = {
  name: 'unexpected details in commune',
  selector: /\s*\(.*\)\s*/u,
  field: 'Commune',
  fix: (toFix: number | string): string => toFix.toString().replace(/\s*\(.*\)\s*/u, '')
};

const FIX_MISSING_0_IN_CODE_POSTAL: CleanOperation = {
  name: 'missing 0 in code postal',
  selector: /^\d{4}$/u,
  field: 'CP',
  fix: (codePostal: number | string): string => `0${codePostal}`
};

const FIX_MISSING_CODE_POSTAL: CleanOperation = {
  name: 'missing code postal',
  selector: /^$/u,
  field: 'CP',
  fix: (_: string, maineEtLoireLieuMediationNumerique?: MaineEtLoireLieuMediationNumerique): string =>
    maineEtLoireLieuMediationNumerique == null
      ? throwMissingFixRequiredDataError()
      : processCodePostal(maineEtLoireLieuMediationNumerique.CP.toString(), maineEtLoireLieuMediationNumerique.Commune)
};

export const CLEAN_OPERATIONS: CleanOperation[] = [
  FIX_WRONG_ACCENT_CHARS_IN_COMMUNE,
  FIX_UNEXPECTED_DETAILS_IN_COMMUNE,
  FIX_MISSING_0_IN_CODE_POSTAL,
  FIX_MISSING_CODE_POSTAL
];
