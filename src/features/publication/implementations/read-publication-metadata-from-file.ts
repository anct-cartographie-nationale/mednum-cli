import { readJsonFileIfExists } from '../../../libraries/file-system';
import type { PublishMetadata } from '../domain';
import type { ReadPublicationMetadata } from '../keys';

/**
 * Un fichier de métadonnées absent n'est pas une erreur : il signifie qu'il n'y a rien à
 * publier pour ce producteur. Un fichier illisible en est une, et le reste.
 */
export const readPublicationMetadataFromFile: ReadPublicationMetadata = (metadataFile: string): PublishMetadata | undefined =>
  readJsonFileIfExists(metadataFile) as PublishMetadata | undefined;
