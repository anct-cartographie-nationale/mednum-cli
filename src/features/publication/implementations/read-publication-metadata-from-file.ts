import { readJsonFileIfExists } from '../../../libraries/file-system/index';
import type { PublishMetadata } from '../domain/index';
import type { ReadPublicationMetadata } from '../keys/index';

/**
 * Un fichier de métadonnées absent n'est pas une erreur : il signifie qu'il n'y a rien à
 * publier pour ce producteur. Un fichier illisible en est une, et le reste.
 */
export const readPublicationMetadataFromFile: ReadPublicationMetadata = (metadataFile: string): PublishMetadata | undefined =>
  readJsonFileIfExists(metadataFile) as PublishMetadata | undefined;
