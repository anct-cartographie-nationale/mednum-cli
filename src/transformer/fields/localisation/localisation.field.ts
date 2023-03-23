/* eslint-disable max-lines-per-function, max-statements, prefer-named-capture-group, @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition */
import { Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import axios, { AxiosResponse } from 'axios';
import { Colonne, Dissociation, LieuxMediationNumeriqueMatching, DataSource, Jonction } from '../../input';

const isColonne = (colonneToTest: Partial<Colonne> & Partial<Dissociation>): colonneToTest is Colonne =>
  colonneToTest.colonne != null;

const dissocier = (source: DataSource, coordonnee: Dissociation & Partial<Colonne>): string | undefined =>
  source[coordonnee.dissocier.colonne]
    ?.replace(/[^\d.\s,-]+/gu, '')
    ?.split(coordonnee.dissocier.séparateur)
    .filter((coord: string): boolean => coord !== '')[coordonnee.dissocier.partie];

const latitudeField = async (
  source: DataSource,
  latitude: Dissociation & Partial<Colonne>,
  adresse: Jonction & Partial<Colonne>,
  commune: Colonne,
  codePostal: Colonne
): Promise<string> => {
  let finalLatitude: string | undefined = '';
  if (isColonne(latitude) && source[latitude.colonne] !== '') finalLatitude = source[latitude.colonne];
  if (isColonne(latitude) && source[latitude.colonne] === '') {
    const coordinates: { latitude: number; longitude: number } = await geocodeAddress(source, adresse, commune, codePostal);
    finalLatitude = isNaN(coordinates.latitude) ? '' : coordinates.latitude.toString();
  } else finalLatitude = dissocier(source, latitude) ?? '';
  return finalLatitude.toString().replace(',', '.');
};

const longitudeField = async (
  source: DataSource,
  longitude: Dissociation & Partial<Colonne>,
  adresse: Jonction & Partial<Colonne>,
  commune: Colonne,
  codePostal: Colonne
): Promise<string> => {
  let finalLongitude: string | undefined = '';
  if (isColonne(longitude) && source[longitude.colonne] !== '') finalLongitude = source[longitude.colonne];
  if (isColonne(longitude) && source[longitude.colonne] === '') {
    const coordinates: { latitude: number; longitude: number } = await geocodeAddress(source, adresse, commune, codePostal);
    finalLongitude = isNaN(coordinates.longitude) ? '' : coordinates.longitude.toString();
  } else finalLongitude = dissocier(source, longitude) ?? '';
  return finalLongitude.toString().replace(',', '.');
};

async function geocodeAddress(
  source: DataSource,
  address: Jonction & Partial<Colonne>,
  commune: Colonne,
  codePostal: Colonne
): Promise<{ latitude: number; longitude: number }> {
  let adresse: string | undefined = '';
  let codePost: string | undefined = '';
  if (isColonne(address) && isColonne(codePostal) && isColonne(commune)) {
    adresse = source[address.colonne]?.toString() ?? '';
    codePost = source[codePostal.colonne];
  }

  const encodeAdresse: string = adresse
    .replace(/\s*\(.*?\)\s*/gu, ' ')
    .replace(/^(.*),.*$/u, '$1')
    .replace(/\s+$/u, '')
    .replace(/\s/gu, '+');

  const baseAdresseNatApi: string = `https://api-adresse.data.gouv.fr/search/?q=${encodeAdresse}&postcode=${codePost}`;

  const response: AxiosResponse = await axios.get(baseAdresseNatApi);

  let baseAdresseReponse: string[] = [];
  if (response.data.features?.[0]?.geometry) {
    baseAdresseReponse = response.data.features[0].geometry?.coordinates;
  }
  return {
    latitude: parseFloat(baseAdresseReponse[1] ?? ''),
    longitude: parseFloat(baseAdresseReponse[0] ?? '')
  };
}

export const processLocalisation = async (
  source: DataSource,
  matching: LieuxMediationNumeriqueMatching
): Promise<Localisation> =>
  Localisation({
    latitude: +(
      (await latitudeField(source, matching.latitude, matching.adresse, matching.commune, matching.code_postal)) ?? 0
    ),
    longitude: +(
      (await longitudeField(source, matching.longitude, matching.adresse, matching.commune, matching.code_postal)) ?? 0
    )
  });
