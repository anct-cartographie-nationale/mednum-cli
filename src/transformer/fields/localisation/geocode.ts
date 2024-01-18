import { Adresse, Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';

export type Geocode = (address: Adresse) => () => Promise<Localisation>;
