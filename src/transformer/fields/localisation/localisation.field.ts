import { Localisation, LocalisationToValidate, isValidLocalisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Colonne, Dissociation, LieuxMediationNumeriqueMatching, DataSource } from '../../input';

type NoLocalisation = { noLocalisation: true } & null;
export const NO_LOCALISATION: Localisation = null as NoLocalisation;

const NO_LOCALISATION_COLONNE: number = NaN;
const INVALID_NUMBERS_CHARS: RegExp = /[^\d.\s,-]+/gu;

const isColonne = (colonneToTest: Partial<Colonne> & Partial<Dissociation>): colonneToTest is Colonne =>
  colonneToTest.colonne != null;

const dissocier = (source: DataSource, localisation: Dissociation & Partial<Colonne>): string | undefined =>
  source[localisation.dissocier.colonne]
    ?.replace(INVALID_NUMBERS_CHARS, '')
    ?.split(localisation.dissocier.séparateur)
    .filter((coord: string): boolean => coord !== '')[localisation.dissocier.partie];

const localisationField = (source: DataSource, localisation: Dissociation & Partial<Colonne>): string | undefined =>
  (isColonne(localisation) ? source[localisation.colonne] : dissocier(source, localisation))?.toString().replace(',', '.');

const validateLocalisationField = (localisationToValidate: LocalisationToValidate): Localisation =>
  isValidLocalisation(localisationToValidate) ? localisationToValidate : NO_LOCALISATION;

const localisationFromMatching = (source: DataSource, matching: LieuxMediationNumeriqueMatching): LocalisationToValidate => ({
  latitude: +(localisationField(source, matching.latitude) ?? NO_LOCALISATION_COLONNE),
  longitude: +(localisationField(source, matching.longitude) ?? NO_LOCALISATION_COLONNE)
});

export const processLocalisation = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Localisation =>
  validateLocalisationField(localisationFromMatching(source, matching));
