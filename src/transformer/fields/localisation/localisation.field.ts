import { Localisation, LocalisationToValidate, isValidLocalisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { Colonne, Dissociation, LieuxMediationNumeriqueMatching, DataSource } from '../../input';

/* eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/typedef, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const proj4 = require('proj4');

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

const checkFormatLocalisation = (localisation: LocalisationToValidate): Localisation => {
  if (localisation === NO_LOCALISATION || Number.isNaN(localisation.latitude) || Number.isNaN(localisation.longitude))
    return NO_LOCALISATION;
  proj4.defs(
    'EPSG:9793',
    '+proj=lcc +lat_0=46.5 +lon_0=3 +lat_1=49 +lat_2=44 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
  );
  const [longitude, latitude]: number[] = proj4('EPSG:9793', 'EPSG:4326', [localisation.longitude, localisation.latitude]);
  return latitude != null && longitude != null ? Localisation({ latitude, longitude }) : NO_LOCALISATION;
};

const localisationField = (source: DataSource, localisation: Dissociation & Partial<Colonne>): string | undefined =>
  (isColonne(localisation) ? source[localisation.colonne] : dissocier(source, localisation))?.toString().replace(',', '.');

const validateLocalisationField = (localisationToValidate: LocalisationToValidate): Localisation =>
  isValidLocalisation(localisationToValidate) ? localisationToValidate : checkFormatLocalisation(localisationToValidate);

const localisationFromMatching = (source: DataSource, matching: LieuxMediationNumeriqueMatching): LocalisationToValidate => ({
  latitude: +(localisationField(source, matching.latitude) ?? NO_LOCALISATION_COLONNE),
  longitude: +(localisationField(source, matching.longitude) ?? NO_LOCALISATION_COLONNE)
});

export const processLocalisation = (source: DataSource, matching: LieuxMediationNumeriqueMatching): Localisation =>
  validateLocalisationField(localisationFromMatching(source, matching));
