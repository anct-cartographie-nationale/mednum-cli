import { beforeEach, describe, expect, it } from 'vitest';
import { provide } from '../../../../libraries/injection';
import type { Dataset, DatasetRepository, PublishDataset, PublishMetadata, PublishRessource } from '../../domain';
import { DATASET_REPOSITORY, READ_PUBLICATION_METADATA, READ_RESSOURCE_RECORDS } from '../../keys';
import { publierUnJeuDeDonnees } from './publier-un-jeu-de-donnees';

const REFERENCE = { id: 'une-organisation', isOwner: false };

const METADATA: PublishMetadata = {
  title: 'Lieux de médiation numérique sur le territoire Paris fournis par Test',
  description: 'Des lieux',
  tags: ['inclusion'],
  frequency: 'daily',
  license: 'lov2',
  granularity: 'poi',
  start: '2026-01-01',
  end: '2026-01-31',
  ressources: [
    { source: './sortie/lieux.csv', schema: 'LaMednum/standard-mediation-num', description: 'CSV' },
    { source: './sortie/lieux.json', schema: 'LaMednum/standard-mediation-num', description: 'JSON' }
  ]
};

const published: PublishDataset[] = [];
const uploaded: PublishRessource[] = [];

const provideImplementations = (metadata: PublishMetadata | undefined, records: Record<string, unknown[]>): void => {
  provide(READ_PUBLICATION_METADATA, (): PublishMetadata | undefined => metadata);
  provide(READ_RESSOURCE_RECORDS, (source: string): unknown[] => records[source] ?? []);
  provide(DATASET_REPOSITORY, {
    get: async (): Promise<Dataset[]> => [],
    post: async (datasetToCreate: PublishDataset): Promise<Dataset> => {
      published.push(datasetToCreate);
      return { id: 'un-id', description: '', frequency: '', title: datasetToCreate.title, ressources: [] };
    },
    addRessourceTo:
      () =>
      async (ressource: PublishRessource): Promise<void> => {
        uploaded.push(ressource);
      }
  } as unknown as DatasetRepository);
};

describe('publierUnJeuDeDonnees', (): void => {
  beforeEach((): void => {
    published.length = 0;
    uploaded.length = 0;
  });

  it('publie le jeu de données décrit par les métadonnées', async (): Promise<void> => {
    provideImplementations(METADATA, { './sortie/lieux.json': [{ id: 'a' }] });

    const publication = await publierUnJeuDeDonnees({
      metadataFile: './sortie/publier.json',
      zone: 'fr:commune:75056',
      reference: REFERENCE
    });

    expect(publication).toStrictEqual({ published: true, title: METADATA.title });
    expect(published).toHaveLength(1);
    expect(uploaded.map(({ source }: PublishRessource): string => source)).toStrictEqual([
      './sortie/lieux.csv',
      './sortie/lieux.json'
    ]);
  });

  it('ajoute la zone demandée aux métadonnées publiées', async (): Promise<void> => {
    provideImplementations(METADATA, { './sortie/lieux.json': [{ id: 'a' }] });

    await publierUnJeuDeDonnees({
      metadataFile: './sortie/publier.json',
      zone: 'fr:commune:75056',
      reference: REFERENCE
    });

    expect(published[0]?.zone).toBe('fr:commune:75056');
  });

  it('ne publie rien quand les métadonnées sont absentes', async (): Promise<void> => {
    provideImplementations(undefined, {});

    expect(
      await publierUnJeuDeDonnees({ metadataFile: './absent.json', zone: 'country:fr', reference: REFERENCE })
    ).toStrictEqual({ published: false, reason: 'metadata-introuvable' });
    expect(published).toStrictEqual([]);
  });

  /**
   * Garde essentielle : publier un jeu de données vide écraserait les lieux déjà en ligne.
   */
  it('ne publie rien quand la ressource des lieux est vide', async (): Promise<void> => {
    provideImplementations(METADATA, { './sortie/lieux.json': [] });

    expect(
      await publierUnJeuDeDonnees({ metadataFile: './sortie/publier.json', zone: 'country:fr', reference: REFERENCE })
    ).toStrictEqual({ published: false, reason: 'ressource-vide' });
    expect(published).toStrictEqual([]);
  });

  it('ne publie rien quand les métadonnées ne décrivent pas la ressource des lieux', async (): Promise<void> => {
    provideImplementations({ ...METADATA, ressources: [] }, {});

    expect(
      await publierUnJeuDeDonnees({ metadataFile: './sortie/publier.json', zone: 'country:fr', reference: REFERENCE })
    ).toStrictEqual({ published: false, reason: 'ressource-vide' });
  });
});
