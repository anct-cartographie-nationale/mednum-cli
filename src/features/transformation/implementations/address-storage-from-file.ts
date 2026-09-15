import * as fs from 'node:fs';
import type { AddressRecord } from '../domain/index.js';
import type { LoadAddressStorage } from '../keys/index.js';

/**
 * Cache des adresses déjà géocodées lors des transformations précédentes. Son absence n'est
 * pas une erreur : la transformation regéocode alors tout, plus lentement mais correctement.
 * C'est le cas par défaut hors du dépôt, le fichier n'étant pas livré avec le paquet.
 */
export const addressStorageFromFile =
  (filePath: string): LoadAddressStorage =>
  (): AddressRecord[] => {
    if (!fs.existsSync(filePath)) return [];

    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as AddressRecord[];
  };
