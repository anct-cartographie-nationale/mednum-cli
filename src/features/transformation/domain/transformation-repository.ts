import type { Adresse, Localisation } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { FindCommune, IsInFrr, IsInQpv } from '../../../libraries/collectivites';
import type { DiffSinceLastTransform, Fingerprint } from './diff-since-last-transform';
import type { DataSource, LieuxMediationNumeriqueMatching } from './matching';

/** Géocode une adresse. L'implémentation traduit ses erreurs de transport en GeocodingError. */
export type Geocode = (address: Adresse) => () => Promise<Localisation>;

/**
 * Vue que la transformation a de ses dépendances pendant qu'elle parcourt une source. Elle est
 * assemblée une fois, à partir des contrats déclarés dans `keys`, plutôt que réinjectée à
 * chaque lieu rencontré.
 */
export type TransformationRepository = {
  config: LieuxMediationNumeriqueMatching;
  findCommune: FindCommune;
  isInQpv: IsInQpv;
  isInFrr: IsInFrr;
  geocode: Geocode;
  fingerprints: Fingerprint[];
  diffSinceLastTransform: (sourceItems: DataSource[]) => DiffSinceLastTransform;
};
