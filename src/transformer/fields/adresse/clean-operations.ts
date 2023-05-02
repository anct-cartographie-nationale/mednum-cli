/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */

import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
// import { isColonne } from './adresse.field';

const communes: Commune[] = require('../../../data/communes.json');

type Commune = { Nom_commune: string; Code_postal: number };

export type CleanOperation = {
  name: string;
  selector: RegExp;
  field: string;
  negate?: boolean;
  fix?: (toFix: string, source?: DataSource) => string;
};

const FIX_WRONG_ACCENT_CHARS_IN_COMMUNE = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'replace ╢ with Â',
  selector: /╢/u,
  field: matching.commune.colonne,
  fix: (toFix: string): string => toFix.replace('╢', 'Â')
});

const FIX_MULTILINES_IN_VOIE = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'replace \\n with space',
  selector: /\n|\\n/u,
  field: matching.adresse.colonne ?? '',
  fix: (toFix: string): string => toFix.replace(/\n|\\n/u, ' ')
});

const toCommuneName = (commune: Commune): string => commune.Nom_commune.toLowerCase();

const formatToCommuneNameData = (commune: string): string =>
  commune.toLowerCase().replace('saint', 'st').replace(/['-]/gu, ' ').replace(/\s+$/u, '');

const formatCodePostal = (codePostal: string): string => (codePostal.length === 4 ? `0${codePostal}` : codePostal);

const ofMatchingCommuneName =
  (matchingCommuneName: string) =>
  (communeName: string): boolean =>
    communeName === formatToCommuneNameData(matchingCommuneName);

const findCodePostal = (matchingCommuneName: string): string =>
  communes[communes.map(toCommuneName).findIndex(ofMatchingCommuneName(matchingCommuneName))]?.Code_postal.toString() ?? '';

const codePostalFromCommune = (commune: string): string => formatCodePostal(findCodePostal(commune));

const processCodePostal = (source: DataSource, matching: LieuxMediationNumeriqueMatching): string =>
  (source[matching.code_postal.colonne] ?? '') === ''
    ? codePostalFromCommune(source[matching.commune.colonne] ?? '')
    : source[matching.code_postal.colonne] ?? '';

const throwMissingFixRequiredDataError = (): string => {
  throw new Error('Missing fix required data');
};

const FIX_MISSING_CODE_POSTAL = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'missing code postal',
  selector: /^$/u,
  field: matching.code_postal.colonne,
  fix: (_: string, source?: DataSource): string =>
    source == null ? throwMissingFixRequiredDataError() : processCodePostal(source, matching)
});

const FIX_MISSING_0_IN_CODE_POSTAL = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'missing 0 in code postal',
  selector: /^\d{4}$/u,
  field: matching.code_postal.colonne,
  fix: (toFix: number | string): string => `0${toFix}`
});

const FIX_CODE_POSTAL_EXTRA_CHAR = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'extra char in code postal',
  selector: /\d+\.\d+/u,
  field: matching.code_postal.colonne,
  fix: (toFix: number | string): string =>
    parseInt(toFix.toString(), 10)
      .toString()
      .replace(/\d+\.\d+/u, '$&')
});

const FIX_UNEXPECTED_DETAILS_IN_COMMUNE = (matching: LieuxMediationNumeriqueMatching): CleanOperation => ({
  name: 'unexpected details in commune',
  selector: /\s*\(.*\)\s*/u,
  field: matching.commune.colonne,
  fix: (toFix: number | string): string => toFix.toString().replace(/\s*\(.*\)\s*/u, '')
});

export const CLEAN_OPERATIONS = (matching: LieuxMediationNumeriqueMatching): CleanOperation[] => [
  FIX_UNEXPECTED_DETAILS_IN_COMMUNE(matching),
  FIX_WRONG_ACCENT_CHARS_IN_COMMUNE(matching),
  FIX_MISSING_CODE_POSTAL(matching),
  FIX_MISSING_0_IN_CODE_POSTAL(matching),
  FIX_CODE_POSTAL_EXTRA_CHAR(matching),
  FIX_MULTILINES_IN_VOIE(matching)
];
