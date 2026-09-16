import { readJsonFileIfExists } from '../../../libraries/file-system';
import { AddressCache, type AddressRecord } from '../domain';
import type { LoadAddressStorage } from '../keys';

/**
 * Cache des adresses déjà géocodées lors des transformations précédentes. Son absence n'est
 * pas une erreur : la transformation regéocode alors tout, plus lentement mais correctement.
 * C'est le cas par défaut hors du dépôt, le fichier n'étant pas livré avec le paquet.
 *
 * Le fichier est produit par concaténation des sorties de chaque exécution, et peut donc
 * porter plusieurs entrées pour une même adresse. Le passer par le cache les réduit à une,
 * en retenant le géocodage plutôt que la tentative infructueuse.
 */
export const addressStorageFromFile =
  (filePath: string): LoadAddressStorage =>
  (): AddressRecord[] =>
    AddressCache((readJsonFileIfExists(filePath) ?? []) as AddressRecord[]).records();
