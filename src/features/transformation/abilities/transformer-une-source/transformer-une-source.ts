import type { LieuMediationNumerique, SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { flatten } from 'flat';
import { inject, injectOr } from '../../../../libraries/injection';
import { type Journal, JOURNAL, silentJournal } from '../../../../libraries/journal';
import {
  AddressCache,
  type AddressRecord,
  type BatchGeocoding,
  type DataSource,
  getAddressData,
  isFlatten,
  isLocated,
  type LocationEnriched,
  normalizedAddress,
  type NormalizedAddress,
  Report,
  type SourceEvidence,
  sourceEvidence,
  toLieuxMediationNumerique,
  type TransformationRepository,
  validValuesOnly
} from '../../domain';
import {
  GEOCODE,
  GEOCODE_BATCH,
  LOAD_ADDRESS_STORAGE,
  LOAD_MATCHING,
  LOAD_SOURCE,
  LOAD_TERRITORIAL_ENRICHMENT,
  SAVE_ADDRESSES,
  SAVE_ERRORS,
  SAVE_OUTPUTS
} from '../../keys';

export type TransformerUneSource = {
  source: string;
  sourceName: string;
  encoding?: string;
  delimiter?: string;
  apiEnvKey?: string;
  /** Limite le nombre d'entrées transformées ; utile pour éprouver une source volumineuse. */
  maxTransform?: number;
};

const BATCH_SIZE = 1000;
const PAUSE_MS = 1000;

const delay = (ms: number): Promise<unknown> => new Promise((resolve: (value: unknown) => void) => setTimeout(resolve, ms));

/**
 * Les valeurs nulles de la source deviennent des chaînes vides : le schéma cible distingue une
 * valeur absente d'une valeur vide, la source pas toujours.
 */
const emptyStringForNull = (_: string, value: unknown): unknown => value ?? '';

// Affirmation : les enregistrements de la source correspondent aux colonnes attendues. C'est
// la configuration de correspondance, plus loin, qui fera foi.
const replaceNullWithEmptyString = (records: unknown[]): DataSource[] =>
  JSON.parse(JSON.stringify(records, emptyStringForNull)) as DataSource[];

const transformBatch = async (
  batch: DataSource[],
  offset: number,
  repository: TransformationRepository,
  sourceName: string,
  report: Report,
  addressCache: AddressCache,
  storage: AddressRecord[]
): Promise<LieuMediationNumerique[]> => {
  // L'aplatissement précède la normalisation : c'est la forme aplatie que lisent les règles de
  // correspondance, et l'adresse ainsi obtenue sert à la fois de question à la BAN, de clé de
  // cache et de valeur publiée — un seul calcul, donc aucune divergence possible entre les trois.
  const lieux: unknown[] = batch.map((dataSource: DataSource) => flatten(dataSource, { safe: isFlatten(repository.config) }));
  const adresses: NormalizedAddress[] = lieux.map(
    (lieu: unknown): NormalizedAddress => normalizedAddress(repository.findCommune)(lieu as DataSource, repository.config)
  );
  // Ce que la source apporte d'elle-même : ses coordonnées corroborent un rapprochement que le
  // score seul ferait rejeter, et son adresse d'origine ira au complément le cas échéant.
  const apports: SourceEvidence[] = await Promise.all(
    lieux.map(async (lieu: unknown): Promise<SourceEvidence> => sourceEvidence(lieu as DataSource, repository.config))
  );
  const responsesBan: BatchGeocoding[] = await inject(GEOCODE_BATCH)(adresses, storage);

  const transformed = await Promise.all(
    lieux.map(async (lieu: unknown, index: number): Promise<LieuMediationNumerique | undefined> => {
      const locationEnriched: LocationEnriched = await getAddressData(
        adresses[index] as NormalizedAddress,
        repository.config,
        apports[index] as SourceEvidence,
        responsesBan[index]
      )(storage);

      return toLieuxMediationNumerique(repository, sourceName, report, addressCache, locationEnriched)(lieu, offset + index);
    })
  );

  return transformed.filter(validValuesOnly);
};

export const transformerUneSource = async ({
  source,
  sourceName,
  encoding,
  delimiter,
  apiEnvKey,
  maxTransform
}: TransformerUneSource): Promise<void> => {
  const journal: Journal = injectOr(JOURNAL, silentJournal);
  const report: Report = Report();
  const addressCache: AddressCache = AddressCache();

  const rawSource: unknown[] = await inject(LOAD_SOURCE)({
    source,
    ...(encoding == null ? {} : { encoding }),
    ...(delimiter == null ? {} : { delimiter }),
    ...(apiEnvKey == null ? {} : { apiEnvKey })
  });
  const sourceItems: DataSource[] = replaceNullWithEmptyString(rawSource).slice(0, maxTransform);

  journal.info('1. Initialisation des services tiers');
  const repository: TransformationRepository = {
    config: await inject(LOAD_MATCHING)(),
    ...(await inject(LOAD_TERRITORIAL_ENRICHMENT)()),
    geocode: inject(GEOCODE)
  };
  const storage: AddressRecord[] = inject(LOAD_ADDRESS_STORAGE)();

  journal.info('2. Transformation des données vers le schéma des lieux de mediation numérique');
  const lieuxDeMediationNumerique: LieuMediationNumerique[] = [];

  for (let offset = 0; offset < sourceItems.length; offset += BATCH_SIZE) {
    lieuxDeMediationNumerique.push(
      ...(await transformBatch(
        sourceItems.slice(offset, offset + BATCH_SIZE),
        offset,
        repository,
        sourceName,
        report,
        addressCache,
        storage
      ))
    );
    if (offset + BATCH_SIZE < sourceItems.length) await delay(PAUSE_MS);
  }

  journal.info(`3. Sauvegarde du rapport d'erreur ${report.records().length}`);
  inject(SAVE_ERRORS)(report);

  const localises: LieuMediationNumerique[] = lieuxDeMediationNumerique.filter(isLocated);
  const ecartes: number = lieuxDeMediationNumerique.length - localises.length;
  journal.info(`4. Sauvegarde des sorties : ${localises.length} (écartés faute de coordonnées : ${ecartes})`);
  inject(SAVE_OUTPUTS)(localises);

  journal.info(`5. Sauvegarde de l'historique: + ${addressCache.records().length}`);
  inject(SAVE_ADDRESSES)(addressCache);
};

export type { SchemaLieuMediationNumerique };
