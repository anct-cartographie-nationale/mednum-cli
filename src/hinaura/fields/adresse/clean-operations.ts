/* eslint-disable @typescript-eslint/naming-convention,  @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */

import { processCodePostal, throwMissingFixRequiredDataError } from '../../../tools';
import { HinauraLieuMediationNumerique } from '../../helper';

export type CleanOperation = {
  name: string;
  selector: RegExp;
  field: 'Adresse postale *' | 'Code postal' | 'Ville *';
  negate?: boolean;
  fix?: (toFix: string, hinauraLieuMediationNumerique?: HinauraLieuMediationNumerique) => string;
};

const FIX_WRONG_ACCENT_CHARS_IN_COMMUNE: CleanOperation = {
  name: 'replace ╢ with Â',
  selector: /╢/u,
  field: 'Ville *',
  fix: (toFix: string): string => toFix.replace('╢', 'Â')
};

const FIX_MISSING_CODE_POSTAL: CleanOperation = {
  name: 'missing code postal',
  selector: /^$/u,
  field: 'Code postal',
  fix: (_: string, hinauraLieuMediationNumerique?: HinauraLieuMediationNumerique): string =>
    hinauraLieuMediationNumerique == null
      ? throwMissingFixRequiredDataError()
      : processCodePostal(hinauraLieuMediationNumerique['Code postal'], hinauraLieuMediationNumerique['Ville *'])
};

export const CLEAN_OPERATIONS: CleanOperation[] = [FIX_WRONG_ACCENT_CHARS_IN_COMMUNE, FIX_MISSING_CODE_POSTAL];
