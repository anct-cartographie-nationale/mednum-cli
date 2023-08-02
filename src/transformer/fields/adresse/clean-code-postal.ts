import { CleanOperation } from './clean-operations';

const FIX_MISSING_0_IN_CODE_POSTAL: CleanOperation = {
  name: 'missing 0 in code postal',
  selector: /^\d{4}$/u,
  fix: (toFix: number | string): string => `0${toFix}`
};

const FIX_CODE_POSTAL_EXTRA_CHAR: CleanOperation = {
  name: 'extra char in code postal',
  selector: /\d+\.\d+/u,
  fix: (toFix: number | string): string =>
    parseInt(toFix.toString(), 10)
      .toString()
      .replace(/\d+\.\d+/u, '$&')
};

export const CLEAN_CODE_POSTAL: CleanOperation[] = [FIX_MISSING_0_IN_CODE_POSTAL, FIX_CODE_POSTAL_EXTRA_CHAR];

const codePostalFromVoie = (voie: string): string => /\b\d{5}\b/u.exec(voie)?.[0] ?? '';

export const codePostalField = (voie: string, codePostal?: string): string =>
  codePostal?.toString() ?? codePostalFromVoie(voie);
