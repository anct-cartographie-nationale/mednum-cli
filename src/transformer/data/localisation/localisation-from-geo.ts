import { Adresse, Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import axios, { AxiosResponse } from 'axios';
import { NO_LOCALISATION } from '../../fields';

const isValid = (adresse: Adresse, response: AxiosResponse): boolean =>
  response.data.features[0]?.geometry?.coordinates != null &&
  (response.data.features[0].properties.score > 0.6 ||
    (response.data.features[0].properties.score > 0.4 && response.data.features[0].properties.city === adresse.commune));

const toLocalisation = (response: AxiosResponse): Localisation =>
  Localisation({
    latitude: response.data.features[0].geometry.coordinates[1],
    longitude: response.data.features[0].geometry.coordinates[0]
  });

export const localisationByGeocode = (adresse: Adresse) => async (): Promise<Localisation> => {
  const response: AxiosResponse = await axios.get(
    `https://wxs.ign.fr/essentiels/geoportail/geocodage/rest/0.1/search?q=${adresse.voie}&postcode=${adresse.code_postal}&city=${adresse.commune}`
  );

  return isValid(adresse, response) ? toLocalisation(response) : NO_LOCALISATION;
};
