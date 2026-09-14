import * as fs from 'node:fs';
import type { SchemaLieuMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { fromSchemaLieuDeMediationNumerique } from '@gouvfr-anct/lieux-de-mediation-numerique';
import {
  chargerUneSource,
  FETCH_REMOTE_SOURCE,
  fetchRemoteSourceWithAxios,
  READ_LOCAL_SOURCE,
  readLocalSourceFromFile
} from '../../features/acquisition-source/index.js';
import {
  communesFromGeoApi,
  frrFromObservatoireDesTerritoires,
  LOAD_COMMUNES,
  LOAD_FRR,
  LOAD_QPV_SHAPES,
  qpvShapesFromDataGouv,
  qualifierFrr,
  qualifierQpv,
  resoudreCommune
} from '../../features/enrichissement-territorial/index.js';
import { writePublicationMetadataInFile } from '../../features/publication/index.js';
import {
  fetchBanResponseBatch,
  fingerprintsFromFile,
  fingerprintsFromLieuxMediationNumeriqueApi,
  GEOCODE,
  GEOCODE_BATCH,
  addressStorageFromFile,
  LOAD_ADDRESS_STORAGE,
  LOAD_FINGERPRINTS,
  LOAD_MATCHING,
  LOAD_SOURCE,
  LOAD_SOURCE_HASHES,
  LOAD_TERRITORIAL_ENRICHMENT,
  localisationByGeocode,
  PUBLISH_OUTPUTS,
  SAVE_ADDRESSES,
  SAVE_ERRORS,
  SAVE_FINGERPRINTS,
  SAVE_OUTPUTS,
  type Fingerprint,
  saveFingerprintsInFile,
  saveFingerprintsWithLieuxMediationNumeriqueApi,
  saveOutputsInFiles,
  saveOutputsWithLieuxInclusionNumeriqueApi,
  sourcesFromCartographieNationaleApi,
  UPDATE_SOURCE_HASH,
  updateSourceWithCartographieNationaleApi,
  writeAddressesInFiles,
  writeErrorsInFiles,
  WRITE_PUBLICATION_METADATA
} from '../../features/transformation/index.js';
import { fetchLieuxWithDuplicates } from '../../libraries/cartographie-nationale-api/index.js';
import type { Output } from '../../libraries/file-system/index.js';
import type { Api } from '../../libraries/http/index.js';
import { provide } from '../../libraries/injection/index.js';
import { consoleJournal, JOURNAL } from '../../libraries/journal/index.js';
import type { TransformerOptions } from './transformer.options.js';

const DEFAULT_API_URL = 'https://d27gljvji6o5x3.cloudfront.net/api/v0';

const apiOf = ({ cartographieNationaleApiUrl, cartographieNationaleApiKey }: TransformerOptions): Api => ({
  url: cartographieNationaleApiUrl ?? DEFAULT_API_URL,
  key: cartographieNationaleApiKey as string
});

const producerOf = ({ outputDirectory, sourceName, territory }: TransformerOptions): Output => ({
  path: outputDirectory,
  name: sourceName,
  territoire: territory
});

const fingerprintFileOf = ({ configFile }: TransformerOptions): string =>
  configFile.replace('.config.json', '.fingerprint.json');

/**
 * Les lieux déjà publiés sont réécrits en fichiers une fois la source enregistrée : c'est ce
 * que la publication ira chercher.
 */
const publishOutputs = (transformerOptions: TransformerOptions) => async (): Promise<void> => {
  const lieuxToPublish = (
    await fetchLieuxWithDuplicates<SchemaLieuMediationNumerique>(
      apiOf(transformerOptions),
      `source[eq]=${transformerOptions.sourceName}&mergedIds[exists]=false`
    )
  ).map(fromSchemaLieuDeMediationNumerique);

  await saveOutputsInFiles(producerOf(transformerOptions), writePublicationMetadataInFile)(lieuxToPublish);
};

/**
 * Point de concrétisation de la commande. Toute la composition de l'application se lit ici :
 * la transformation déclare ses contrats, l'acquisition de source, l'enrichissement
 * territorial et la publication les réalisent, et le choix entre fichiers et API se fait sur
 * la présence d'une clé d'API.
 */
export const provideTransformerImplementations = (transformerOptions: TransformerOptions): void => {
  const api: Api = apiOf(transformerOptions);
  const producer: Output = producerOf(transformerOptions);
  const useFile: boolean = transformerOptions.cartographieNationaleApiKey == null;

  provide(JOURNAL, consoleJournal);

  provide(FETCH_REMOTE_SOURCE, fetchRemoteSourceWithAxios);
  provide(READ_LOCAL_SOURCE, readLocalSourceFromFile);
  provide(LOAD_SOURCE, chargerUneSource);

  provide(LOAD_COMMUNES, communesFromGeoApi);
  provide(LOAD_QPV_SHAPES, qpvShapesFromDataGouv);
  provide(LOAD_FRR, frrFromObservatoireDesTerritoires);
  provide(LOAD_TERRITORIAL_ENRICHMENT, async () => ({
    findCommune: await resoudreCommune(),
    isInQpv: await qualifierQpv(),
    isInFrr: await qualifierFrr()
  }));

  provide(GEOCODE, localisationByGeocode);
  provide(GEOCODE_BATCH, fetchBanResponseBatch);
  provide(LOAD_ADDRESS_STORAGE, addressStorageFromFile(transformerOptions.addressCache));

  provide(LOAD_MATCHING, async () => JSON.parse(await fs.promises.readFile(transformerOptions.configFile, 'utf-8')));
  provide(
    LOAD_FINGERPRINTS,
    useFile
      ? fingerprintsFromFile(fingerprintFileOf(transformerOptions))
      : fingerprintsFromLieuxMediationNumeriqueApi(api, transformerOptions.sourceName)
  );

  provide(SAVE_ERRORS, writeErrorsInFiles(producer));
  provide(SAVE_ADDRESSES, writeAddressesInFiles(producer));
  provide(WRITE_PUBLICATION_METADATA, writePublicationMetadataInFile);
  provide(
    SAVE_OUTPUTS,
    useFile ? saveOutputsInFiles(producer, writePublicationMetadataInFile) : saveOutputsWithLieuxInclusionNumeriqueApi(api)
  );

  provide(LOAD_SOURCE_HASHES, sourcesFromCartographieNationaleApi(api));
  provide(UPDATE_SOURCE_HASH, updateSourceWithCartographieNationaleApi(api, transformerOptions.sourceName));
  provide(PUBLISH_OUTPUTS, publishOutputs(transformerOptions));

  provide(SAVE_FINGERPRINTS, (idKey: string, fingerprints: Fingerprint[]) =>
    useFile
      ? saveFingerprintsInFile(idKey, fingerprints, fingerprintFileOf(transformerOptions))
      : saveFingerprintsWithLieuxMediationNumeriqueApi(idKey, api, transformerOptions.sourceName)
  );
};
