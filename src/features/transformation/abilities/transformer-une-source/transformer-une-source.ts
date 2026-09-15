import type { LieuMediationNumerique, SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { flatten } from 'flat';
import { inject, injectOr } from '../../../../libraries/injection/index.js';
import { type Journal, JOURNAL, silentJournal } from '../../../../libraries/journal/index.js';
import {
  AddressCache,
  type AddressRecord,
  canTransform,
  type DataSource,
  diffSinceLastTransform,
  type DiffSinceLastTransform,
  type Fingerprint,
  getAddressData,
  isFlatten,
  type LieuxMediationNumeriqueMatching,
  type LocationEnriched,
  Report,
  toLieuxMediationNumerique,
  type TransformationRepository,
  validValuesOnly
} from '../../domain/index.js';
import {
  GEOCODE,
  GEOCODE_BATCH,
  LOAD_ADDRESS_STORAGE,
  LOAD_FINGERPRINTS,
  LOAD_MATCHING,
  LOAD_SOURCE,
  LOAD_TERRITORIAL_ENRICHMENT,
  SAVE_ADDRESSES,
  SAVE_ERRORS,
  SAVE_FINGERPRINTS,
  SAVE_OUTPUTS
} from '../../keys/index.js';

export type TransformerUneSource = {
  source: string;
  sourceName: string;
  encoding?: string;
  delimiter?: string;
  apiEnvKey?: string;
  /** N'enregistre pas les empreintes de cette transformation. */
  force: boolean;
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
const replaceNullWithEmptyString = (jsonString: string): string =>
  JSON.stringify(JSON.parse(jsonString), (_: string, values?: string): string => values ?? '');

const lieuxToTransform = (sourceItems: DataSource[], diff: DiffSinceLastTransform): DataSource[] =>
  canTransform(diff) ? diff.toUpsert : sourceItems;

const nothingToTransform = (diff: DiffSinceLastTransform): boolean =>
  canTransform(diff) && diff.toDelete.length === 0 && diff.toUpsert.length === 0;

const transformBatch = async (
  batch: DataSource[],
  offset: number,
  repository: TransformationRepository,
  sourceName: string,
  report: Report,
  addressCache: AddressCache,
  storage: AddressRecord[]
): Promise<LieuMediationNumerique[]> => {
  const responsesBan: unknown[] = await inject(GEOCODE_BATCH)(batch, repository.config, storage);

  const transformed = await Promise.all(
    batch
      .map((dataSource: DataSource) => flatten(dataSource, { safe: isFlatten(repository.config) }))
      .map(async (lieu: unknown, index: number): Promise<LieuMediationNumerique | undefined> => {
        const locationEnriched: LocationEnriched = await getAddressData(
          lieu as DataSource,
          repository.config,
          responsesBan[index] as never
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
  force,
  maxTransform
}: TransformerUneSource): Promise<void> => {
  const journal: Journal = injectOr(JOURNAL, silentJournal);
  const report: Report = Report();
  const addressCache: AddressCache = AddressCache();

  const rawSource: string = await inject(LOAD_SOURCE)({
    source,
    ...(encoding == null ? {} : { encoding }),
    ...(delimiter == null ? {} : { delimiter }),
    ...(apiEnvKey == null ? {} : { apiEnvKey })
  });
  const sourceItems: DataSource[] = JSON.parse(replaceNullWithEmptyString(rawSource)).slice(0, maxTransform);

  journal.info('1. Initialisation des services tiers');
  const config: LieuxMediationNumeriqueMatching = await inject(LOAD_MATCHING)();
  const idKey: string = config.id?.colonne ?? '';
  const fingerprints: Fingerprint[] = await inject(LOAD_FINGERPRINTS)();
  const repository: TransformationRepository = {
    config,
    ...(await inject(LOAD_TERRITORIAL_ENRICHMENT)()),
    geocode: inject(GEOCODE),
    fingerprints,
    diffSinceLastTransform: diffSinceLastTransform(idKey, fingerprints)
  };

  journal.info('2. Calcul de la différence depuis la dernière transformation');
  const diff: DiffSinceLastTransform = repository.diffSinceLastTransform(sourceItems);

  if (nothingToTransform(diff)) {
    journal.info("3. Il n'y a rien à transformer");
    return;
  }

  const lieux: DataSource[] = lieuxToTransform(sourceItems, diff);
  const storage: AddressRecord[] = inject(LOAD_ADDRESS_STORAGE)();

  journal.info('3. Transformation des données vers le schéma des lieux de mediation numérique');
  const lieuxDeMediationNumerique: LieuMediationNumerique[] = [];

  for (let offset = 0; offset < lieux.length; offset += BATCH_SIZE) {
    lieuxDeMediationNumerique.push(
      ...(await transformBatch(
        lieux.slice(offset, offset + BATCH_SIZE),
        offset,
        repository,
        sourceName,
        report,
        addressCache,
        storage
      ))
    );
    if (offset + BATCH_SIZE < lieux.length) await delay(PAUSE_MS);
  }

  if (canTransform(diff)) {
    journal.info(`Lieux à ajouter : ${diff.toUpsert.length}`);
    journal.info(`Lieux à supprimer : ${diff.toDelete.length}`);
  }

  journal.info(`4. Sauvegarde du rapport d'erreur ${report.records().length}`);
  inject(SAVE_ERRORS)(report);

  const sansLocalisation: number = lieuxDeMediationNumerique.filter(
    (lieu: LieuMediationNumerique): boolean => !lieu.localisation
  ).length;
  journal.info(
    `5. Sauvegarde des sorties :  ${lieuxDeMediationNumerique.length} (dont lieux sans localisation :  ${sansLocalisation} )`
  );
  await inject(SAVE_OUTPUTS)(lieuxDeMediationNumerique);

  journal.info(`6. Sauvegarde de l'historique: + ${addressCache.records().length}`);
  inject(SAVE_ADDRESSES)(addressCache);

  if (force) return;

  journal.info('7. Sauvegarde des empreintes');
  await inject(SAVE_FINGERPRINTS)(idKey, fingerprints)(diff);
};

export type { SchemaLieuMediationNumerique };
