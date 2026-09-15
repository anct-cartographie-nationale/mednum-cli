import * as fs from 'node:fs';
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
  addressStorageFromFile,
  fetchBanResponseBatch,
  type Fingerprint,
  fingerprintsFromFile,
  GEOCODE,
  GEOCODE_BATCH,
  LOAD_ADDRESS_STORAGE,
  LOAD_FINGERPRINTS,
  LOAD_MATCHING,
  LOAD_SOURCE,
  LOAD_TERRITORIAL_ENRICHMENT,
  type LieuxMediationNumeriqueMatching,
  localisationByGeocode,
  SAVE_ADDRESSES,
  SAVE_ERRORS,
  SAVE_FINGERPRINTS,
  SAVE_OUTPUTS,
  saveFingerprintsInFile,
  saveOutputsInFiles,
  WRITE_PUBLICATION_METADATA,
  writeAddressesInFiles,
  writeErrorsInFiles
} from '../../features/transformation/index.js';
import type { Output } from '../../libraries/file-system/index.js';
import { provide } from '../../libraries/injection/index.js';
import { consoleJournal, JOURNAL } from '../../libraries/journal/index.js';
import type { TransformerOptions } from './transformer.options.js';

const producerOf = ({ outputDirectory, sourceName, territory }: TransformerOptions): Output => ({
  path: outputDirectory,
  name: sourceName,
  territoire: territory
});

const fingerprintFileOf = ({ configFile }: TransformerOptions): string =>
  configFile.replace('.config.json', '.fingerprint.json');

/**
 * Point de concrétisation de la commande. Toute la composition de l'application se lit ici :
 * la transformation déclare ses contrats, l'acquisition de source, l'enrichissement
 * territorial et la publication les réalisent.
 */
export const provideTransformerImplementations = (transformerOptions: TransformerOptions): void => {
  const producer: Output = producerOf(transformerOptions);

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

  provide(
    LOAD_MATCHING,
    async (): Promise<LieuxMediationNumeriqueMatching> =>
      JSON.parse(await fs.promises.readFile(transformerOptions.configFile, 'utf-8')) as LieuxMediationNumeriqueMatching
  );
  provide(LOAD_FINGERPRINTS, fingerprintsFromFile(fingerprintFileOf(transformerOptions)));
  provide(SAVE_FINGERPRINTS, (idKey: string, fingerprints: Fingerprint[]) =>
    saveFingerprintsInFile(idKey, fingerprints, fingerprintFileOf(transformerOptions))
  );

  provide(SAVE_ERRORS, writeErrorsInFiles(producer));
  provide(SAVE_ADDRESSES, writeAddressesInFiles(producer));
  provide(WRITE_PUBLICATION_METADATA, writePublicationMetadataInFile);
  provide(SAVE_OUTPUTS, saveOutputsInFiles(producer, writePublicationMetadataInFile));
};
