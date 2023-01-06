/* eslint-disable @typescript-eslint/naming-convention, camelcase */

import { Adresse, ModelError } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Colonne, Jonction, Recorder } from '../../../tools';
import { LieuxMediationNumeriqueMatching, DataSource } from '../../input';
import { CLEAN_OPERATIONS, CleanOperation } from './clean-operations';

type FixedAdresse = DataSource | undefined;

const formatCommune = (commune: string): string => commune.charAt(0).toUpperCase() + commune.slice(1);

const formatVoie = (adressePostale: string): string =>
  (adressePostale.includes('\n') ? adressePostale.substring(0, adressePostale.indexOf('\n')) : adressePostale).replace(
    /,/gu,
    ''
  );

const isColonne = (colonneToTest: Partial<Colonne> & Partial<Jonction>): colonneToTest is Colonne =>
  colonneToTest.colonne != null;

const voieField = (source: DataSource, voie: Jonction & Partial<Colonne>): string =>
  isColonne(voie)
    ? source[voie.colonne] ?? ''
    : voie.joindre.colonnes
        .reduce((voiePart: string, colonne: string): string => [voiePart, source[colonne]].join(voie.joindre.séparateur), '')
        .trim();

const toLieuxMediationNumeriqueAdresse = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Adresse =>
  Adresse({
    code_postal: source[matching.code_postal.colonne]?.toString() ?? '',
    commune: formatCommune(source[matching.commune.colonne] ?? ''),
    voie: formatVoie(voieField(source, matching.voie))
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

export const processAdresse =
  (recorder: Recorder) =>
  (source: DataSource, matching: LieuxMediationNumeriqueMatching): Adresse => {
    try {
      return toLieuxMediationNumeriqueAdresse(source, matching);
    } catch (error: unknown) {
      error instanceof ModelError && recorder.record(error.key, error.message);
      return fixAndRetry(recorder)(source, matching, error);
    }
  };
