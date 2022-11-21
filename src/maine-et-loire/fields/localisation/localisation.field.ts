import { Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';

export const processLocalisation = (latitude: string, longitude: string): Localisation =>
  Localisation({
    latitude: parseFloat(latitude.toString()),
    longitude: parseFloat(longitude.toString())
  });
