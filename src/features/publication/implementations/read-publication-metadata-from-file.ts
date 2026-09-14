import * as fs from 'node:fs';
import type { PublishMetadata } from '../domain';
import type { ReadPublicationMetadata } from '../keys';

/**
 * Un fichier de métadonnées absent n'est pas une erreur : il signifie qu'il n'y a rien à
 * publier pour ce producteur.
 */
export const readPublicationMetadataFromFile: ReadPublicationMetadata = (metadataFile: string): PublishMetadata | undefined =>
  fs.existsSync(metadataFile) ? JSON.parse(fs.readFileSync(metadataFile, 'utf8')) : undefined;
