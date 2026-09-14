import { inject } from '../../../../libraries/injection';
import { type PublishMetadata, publishDataset, type Reference } from '../../domain';
import { DATASET_REPOSITORY, READ_PUBLICATION_METADATA, READ_RESSOURCE_RECORDS } from '../../keys';

export type PublierUnJeuDeDonnees = {
  metadataFile: string;
  zone: string;
  reference: Reference;
};

type PublicationSkipped = {
  published: false;
  reason: 'metadata-introuvable' | 'ressource-vide';
};

type PublicationDone = {
  published: true;
  title: string;
};

export type Publication = PublicationDone | PublicationSkipped;

/**
 * La ressource d'index 1 est le fichier JSON des lieux : publier un jeu de données vide
 * écraserait les données en ligne par du néant.
 */
const RESSOURCE_DES_LIEUX = 1;

const isEmpty = (metadata: PublishMetadata): boolean => {
  const source: string | undefined = metadata.ressources[RESSOURCE_DES_LIEUX]?.source;
  return source == null || inject(READ_RESSOURCE_RECORDS)(source).length === 0;
};

export const publierUnJeuDeDonnees = async ({ metadataFile, zone, reference }: PublierUnJeuDeDonnees): Promise<Publication> => {
  const metadata: PublishMetadata | undefined = inject(READ_PUBLICATION_METADATA)(metadataFile);

  if (metadata == null) return { published: false, reason: 'metadata-introuvable' };
  if (isEmpty(metadata)) return { published: false, reason: 'ressource-vide' };

  await publishDataset(inject(DATASET_REPOSITORY), reference)({ ...metadata, zone });

  return { published: true, title: metadata.title };
};
