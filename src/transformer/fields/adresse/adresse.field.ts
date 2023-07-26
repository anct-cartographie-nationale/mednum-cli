/* eslint-disable @typescript-eslint/naming-convention, camelcase, max-lines */

import { Adresse, CodeInseeError, CodePostalError, CommuneError, VoieError } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { LieuxMediationNumeriqueMatching, DataSource, Colonne, Jonction } from '../../input';
import { Recorder } from '../../report';
import { CLEAN_OPERATIONS, CleanOperation } from './clean-operations';

type FixedAdresse = DataSource | undefined;

export type CodeInseeCorrespondancy = {
  fields: {
    insee_com: string;
    postal_code: string;
  };
};

const formatCommune = (commune: string): string =>
  (commune.charAt(0).toUpperCase() + commune.slice(1)).replace(/\s+/gu, ' ').trim();

const formatVoie = (adressePostale: string): string => {
  const keepOnlyVoie: string = /^(?<voie>.*?)\s\d{5}\s\w+/u.exec(adressePostale)?.groups?.['voie'] ?? adressePostale;
  return (keepOnlyVoie.includes('\n') ? keepOnlyVoie.substring(0, keepOnlyVoie.indexOf('\n')) : keepOnlyVoie)
    .replace(//gu, "'")
    .replace(/,/gu, '')
    .replace(/"/gu, '')
    .replace(/\s+/gu, ' ')
    .trim();
};

const isColonne = (colonneToTest: Partial<Colonne> & Partial<Jonction>): colonneToTest is Colonne =>
  colonneToTest.colonne != null;

const voieField = (source: DataSource, voie: Jonction & Partial<Colonne>): string =>
  isColonne(voie)
    ? source[voie.colonne] ?? ''
    : voie.joindre.colonnes
        .reduce((voiePart: string, colonne: string): string => [voiePart, source[colonne]].join(voie.joindre.séparateur), '')
        .trim();

const complementAdresseIfAny = (complementAdresse?: string): { complement_adresse?: string } =>
  complementAdresse == null ? {} : { complement_adresse: complementAdresse.replace(/\s+/gu, ' ').trim() };

const codeInseeIfAny = (codeInsee?: string): { code_insee?: string } => (codeInsee == null ? {} : { code_insee: codeInsee });

const codePostalFromVoie = (voie: string): string => /\b\d{5}\b/u.exec(voie)?.[0] ?? '';

const getCommuneFromVoie = (voie: string): string => /\b\d{5}\b\s*(?<commune>\w+)/u.exec(voie)?.groups?.['commune'] ?? '';

const getCodeInseeFromSource = (source: DataSource, matching: LieuxMediationNumeriqueMatching): string | undefined =>
  source[matching.code_insee?.colonne ?? '']?.toString();

const getCodePostal = (matching: LieuxMediationNumeriqueMatching, source: DataSource): string =>
  matching.code_postal.colonne === ''
    ? codePostalFromVoie(voieField(source, matching.adresse))
    : source[matching.code_postal.colonne]?.toString() ?? '';

const getCommune = (matching: LieuxMediationNumeriqueMatching, source: DataSource): string =>
  matching.commune.colonne === ''
    ? getCommuneFromVoie(voieField(source, matching.adresse))
    : formatCommune(source[matching.commune.colonne] ?? '');

const processCodeInsee =
  (allCodeInsee: CodeInseeCorrespondancy[] = []) =>
  (codePostal: string, codeInsee?: string): string | undefined =>
    allCodeInsee.find((entry: CodeInseeCorrespondancy): boolean => entry.fields.postal_code === codePostal)?.fields.insee_com ??
    codeInsee ??
    undefined;

const toLieuxMediationNumeriqueAdresse = (
  source: DataSource,
  matching: LieuxMediationNumeriqueMatching,
  allCodeInsee?: CodeInseeCorrespondancy[]
): Adresse =>
  Adresse({
    code_postal: getCodePostal(matching, source),
    commune: getCommune(matching, source),
    voie: formatVoie(voieField(source, matching.adresse)),
    ...complementAdresseIfAny(source[matching.complement_adresse?.colonne ?? '']),
    ...codeInseeIfAny(processCodeInsee(allCodeInsee)(getCodePostal(matching, source), getCodeInseeFromSource(source, matching)))
  });

const testCleanSelector = (cleanOperation: CleanOperation, property?: string): boolean =>
  property != null && new RegExp(cleanOperation.selector, 'u').test(property);

const shouldApplyFix = (cleanOperation: CleanOperation, property?: string): boolean =>
  cleanOperation.negate === true ? !testCleanSelector(cleanOperation, property) : testCleanSelector(cleanOperation, property);

const applyUpdateFix =
  (recorder: Recorder) =>
  (cleanOperation: CleanOperation & { fix: (toFix: string) => string }, valueToFix: string, source: DataSource): DataSource => {
    const cleanValue: string = cleanOperation.fix(valueToFix, source);
    recorder.fix({
      apply: cleanOperation.name,
      before: valueToFix,
      after: cleanValue
    });
    return {
      ...source,
      ...{
        [cleanOperation.field]: cleanValue
      }
    };
  };

const cannotApplyFix = (): DataSource => {
  throw new Error('Cannot apply fix to address');
};

const canFix = (cleanOperation: CleanOperation): cleanOperation is CleanOperation & { fix: (toFix: string) => string } =>
  cleanOperation.fix != null;

const applyCleanOperation =
  (recorder: Recorder) =>
  (cleanOperation: CleanOperation, valueToFix: string | undefined, source: DataSource): DataSource =>
    canFix(cleanOperation) && valueToFix != null
      ? applyUpdateFix(recorder)(cleanOperation, valueToFix, source)
      : cannotApplyFix();

const toFixedAdresse =
  (recorder: Recorder) =>
  (source: DataSource) =>
  (adresse: FixedAdresse, cleanOperation: CleanOperation): FixedAdresse =>
    adresse == null && shouldApplyFix(cleanOperation, source[cleanOperation.field]?.toString())
      ? applyCleanOperation(recorder)(cleanOperation, source[cleanOperation.field]?.toString(), source)
      : adresse;

const cannotFixAdresse = (error: unknown): Adresse => {
  throw error;
};

const retryOrThrow =
  (recorder: Recorder) =>
  (fixedAdresse: FixedAdresse, matching: LieuxMediationNumeriqueMatching, error: unknown): Adresse =>
    fixedAdresse == null ? cannotFixAdresse(error) : processAdresse(recorder)(fixedAdresse, matching);

const fixAndRetry =
  (recorder: Recorder) =>
  (source: DataSource, matching: LieuxMediationNumeriqueMatching, error: unknown): Adresse =>
    retryOrThrow(recorder)(CLEAN_OPERATIONS(matching).reduce(toFixedAdresse(recorder)(source), undefined), matching, error);

const handleMissingCodePostalInMatching =
  (recorder: Recorder) =>
  (source: DataSource, matching: LieuxMediationNumeriqueMatching, error: CodePostalError): Adresse => {
    const sourceWithCodePostalMissing: DataSource = { ...source, code_postal: '' };
    const matchingWithCodePostalMissing: LieuxMediationNumeriqueMatching = {
      ...matching,
      code_postal: { colonne: 'code_postal' }
    };
    return fixAndRetry(recorder)(sourceWithCodePostalMissing, matchingWithCodePostalMissing, error);
  };

const throwCommuneOrAdresseErrors = (source: DataSource, matching: LieuxMediationNumeriqueMatching): void => {
  if (source[matching.commune.colonne] === '') throw new CommuneError('');
  else if (isColonne(matching.adresse) && source[matching.adresse.colonne] === '') throw new VoieError('');
};

const checkCommuneAndVoieMissingMatch = (source: DataSource, matching: LieuxMediationNumeriqueMatching): boolean =>
  source[matching.commune.colonne] === '' || (isColonne(matching.adresse) && source[matching.adresse.colonne] === '');

export const processAdresse =
  (recorder: Recorder) =>
  (source: DataSource, matching: LieuxMediationNumeriqueMatching, allCodeInsee?: CodeInseeCorrespondancy[]): Adresse => {
    try {
      return toLieuxMediationNumeriqueAdresse(source, matching, allCodeInsee);
    } catch (error: unknown) {
      if (error instanceof CodePostalError && matching.code_postal.colonne === '')
        return handleMissingCodePostalInMatching(recorder)(source, matching, error);
      if (checkCommuneAndVoieMissingMatch(source, matching)) throwCommuneOrAdresseErrors(source, matching);
      if (error instanceof CodeInseeError) {
        const { [matching.code_insee?.colonne ?? '']: _, ...sourceWithoutCodeInsee }: DataSource = source;
        return toLieuxMediationNumeriqueAdresse(sourceWithoutCodeInsee, matching, allCodeInsee);
      }
      return fixAndRetry(recorder)(source, matching, error);
    }
  };
