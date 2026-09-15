import { readJsonFileIfExists } from '../../../libraries/file-system/index.js';
import type { PublishMetadata } from '../domain/index.js';
import type { ReadPublicationMetadata } from '../keys/index.js';

/**
 * Un fichier de métadonnées absent n'est pas une erreur : il signifie qu'il n'y a rien à
 * publier pour ce producteur. Un fichier illisible en est une, et le reste.
 */
export const readPublicationMetadataFromFile: ReadPublicationMetadata = (metadataFile: string): PublishMetadata | undefined =>
  readJsonFileIfExists(metadataFile) as PublishMetadata | undefined;
