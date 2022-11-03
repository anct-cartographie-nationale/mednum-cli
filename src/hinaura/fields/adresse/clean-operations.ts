/* eslint-disable @typescript-eslint/naming-convention,  @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */

import { HinauraLieuMediationNumerique } from '../../helper';
const communes: Commune[] = require('../../../../assets/data/communes.json');

type Commune = { Nom_commune: string; Code_postal: number };

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

const processCodePostal = (hinauraLieuMediationNumerique: HinauraLieuMediationNumerique): string =>
  hinauraLieuMediationNumerique['Code postal'] === ''
    ? codePostalFromCommune(hinauraLieuMediationNumerique['Ville *'])
    : hinauraLieuMediationNumerique['Code postal'];

const throwMissingFixRequiredDataError = (): string => {
  throw new Error('Missing fix required data');
};

const FIX_MISSING_CODE_POSTAL: CleanOperation = {
  name: 'missing code postal',
  selector: /^$/u,
  field: 'Code postal',
  fix: (_: string, hinauraLieuMediationNumerique?: HinauraLieuMediationNumerique): string =>
    hinauraLieuMediationNumerique == null
      ? throwMissingFixRequiredDataError()
      : processCodePostal(hinauraLieuMediationNumerique)
};

export const CLEAN_OPERATIONS: CleanOperation[] = [FIX_WRONG_ACCENT_CHARS_IN_COMMUNE, FIX_MISSING_CODE_POSTAL];
