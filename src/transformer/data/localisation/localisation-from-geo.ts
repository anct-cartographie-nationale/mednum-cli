import axios, { AxiosResponse } from 'axios';
import { Colonne, DataSource, Dissociation, Jonction, LieuxMediationNumeriqueMatching } from '../../input';

export type LocalisationByGeo = {
  latitude: string;
  longitude: string;
};

const isColonne = (colonneToTest: Partial<Colonne> & Partial<Dissociation>): colonneToTest is Colonne =>
  colonneToTest.colonne != null;

const extractColonneValue = (source: DataSource, field: Colonne | (Jonction & Partial<Colonne>)): string =>
  isColonne(field) ? source[field.colonne]?.toString() ?? '' : '';

export const localisationByGeocode = async (
  source: DataSource,
  matching: LieuxMediationNumeriqueMatching
): Promise<LocalisationByGeo | undefined> => {
  const adresse: string = extractColonneValue(source, matching.adresse)
    .replace(/\s*\(.*?\)\s*/gu, ' ')
    .replace(/^(?<adresse>.*),.*$/u, '$<adresse>')
    .replace(/\s+$/u, '')
    .replace(/\s/gu, '+');
  const codePostal: string = extractColonneValue(source, matching.code_postal);
  const commune: string = extractColonneValue(source, matching.commune);
  const response: AxiosResponse = await axios.get(
    `https://wxs.ign.fr/essentiels/geoportail/geocodage/rest/0.1/search?q=${adresse}&postcode=${codePostal}&city=${commune}`
  );
  let ignReponse: string[] = [];
  if (response.data.features?.[0]?.geometry != null && response.data.features[0].properties.score > 0.7)
    ignReponse = response.data.features[0].geometry?.coordinates;
  return {
    latitude: ignReponse[1]?.toString() ?? '',
    longitude: ignReponse[0]?.toString() ?? ''
  };
};
