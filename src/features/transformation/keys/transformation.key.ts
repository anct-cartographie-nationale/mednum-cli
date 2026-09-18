import type { LieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import type { FindCommune, IsInFrr, IsInQpv } from '../../../libraries/collectivites';
import type { Output } from '../../../libraries/file-system';
import { type InjectionKey, keyFor } from '../../../libraries/injection';
import type {
  AccesLibreIndex,
  AddressCache,
  AddressRecord,
  BatchGeocoding,
  Geocode,
  LieuxMediationNumeriqueMatching,
  NormalizedAddress,
  Report
} from '../domain';

export const GEOCODE: InjectionKey<Geocode> = keyFor<Geocode>('transformation.geocode');

/**
 * Contrat réalisé par la capacité d'enrichissement territorial. La transformation le déclare
 * sans la connaître ; c'est le point d'entrée qui les relie. Le chargement est différé : les
 * référentiels sont volumineux et inutiles quand la source n'a pas changé.
 */
export type TerritorialEnrichment = {
  findCommune: FindCommune;
  isInQpv: IsInQpv;
  isInFrr: IsInFrr;
};

export type LoadTerritorialEnrichment = () => Promise<TerritorialEnrichment>;

export const LOAD_TERRITORIAL_ENRICHMENT: InjectionKey<LoadTerritorialEnrichment> = keyFor<LoadTerritorialEnrichment>(
  'transformation.load-territorial-enrichment'
);

/**
 * Charge les enregistrements bruts de la source à transformer. Réalisé par la capacité
 * d'acquisition, qui les rend tels qu'elle les a lus, sans les interpréter.
 */
export type LoadSource = (settings: {
  source: string;
  encoding?: string;
  delimiter?: string;
  apiEnvKey?: string;
}) => Promise<unknown[]>;

export const LOAD_SOURCE: InjectionKey<LoadSource> = keyFor<LoadSource>('transformation.load-source');

/** Configuration de correspondance entre les colonnes de la source et le schéma cible. */
export type LoadMatching = () => Promise<LieuxMediationNumeriqueMatching>;

export const LOAD_MATCHING: InjectionKey<LoadMatching> = keyFor<LoadMatching>('transformation.load-matching');

/** Adresses déjà géocodées lors des transformations précédentes. */
export type LoadAddressStorage = () => AddressRecord[];

export const LOAD_ADDRESS_STORAGE: InjectionKey<LoadAddressStorage> = keyFor<LoadAddressStorage>(
  'transformation.load-address-storage'
);

/** Géocodage par lot, réaligné sur les positions du lot d'origine. */
export type GeocodeBatch = (adresses: NormalizedAddress[], storage: AddressRecord[]) => Promise<BatchGeocoding[]>;

export const GEOCODE_BATCH: InjectionKey<GeocodeBatch> = keyFor<GeocodeBatch>('transformation.geocode-batch');

export type LoadAccesLibre = () => AccesLibreIndex;

export const LOAD_ACCES_LIBRE: InjectionKey<LoadAccesLibre> = keyFor<LoadAccesLibre>('transformation.load-acces-libre');

export type SaveOutputs = (lieuxDeMediationNumerique: LieuMediationNumerique[]) => void;

export const SAVE_OUTPUTS: InjectionKey<SaveOutputs> = keyFor<SaveOutputs>('transformation.save-outputs');

export type SaveErrors = (report: Report) => void;

export const SAVE_ERRORS: InjectionKey<SaveErrors> = keyFor<SaveErrors>('transformation.save-errors');

export type SaveAddresses = (addressCache: AddressCache) => void;

export const SAVE_ADDRESSES: InjectionKey<SaveAddresses> = keyFor<SaveAddresses>('transformation.save-addresses');

/**
 * Écrit les métadonnées de publication à côté des sorties. Réalisé par la capacité de
 * publication, branché par le point d'entrée.
 */
export type WritePublicationMetadata = (
  producer: Output,
  lieuxDeMediationNumerique: LieuMediationNumerique[],
  suffix?: string
) => void;

export const WRITE_PUBLICATION_METADATA: InjectionKey<WritePublicationMetadata> = keyFor<WritePublicationMetadata>(
  'transformation.write-publication-metadata'
);
