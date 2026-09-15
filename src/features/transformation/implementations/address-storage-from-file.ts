import { readJsonFileIfExists } from '../../../libraries/file-system/index';
import type { AddressRecord } from '../domain/index';
import type { LoadAddressStorage } from '../keys/index';

/**
 * Cache des adresses déjà géocodées lors des transformations précédentes. Son absence n'est
 * pas une erreur : la transformation regéocode alors tout, plus lentement mais correctement.
 * C'est le cas par défaut hors du dépôt, le fichier n'étant pas livré avec le paquet.
 */
export const addressStorageFromFile =
  (filePath: string): LoadAddressStorage =>
  (): AddressRecord[] =>
    (readJsonFileIfExists(filePath) ?? []) as AddressRecord[];
