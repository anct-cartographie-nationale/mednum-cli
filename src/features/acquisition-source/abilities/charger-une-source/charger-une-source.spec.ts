import { beforeEach, describe, expect, it } from 'vitest';
import { provide } from '../../../../libraries/injection';
import type { RemoteSourceSettings } from '../../domain';
import { chargerUneSource } from './charger-une-source';
import type { SourceLocation } from './domain';
import { FETCH_REMOTE_SOURCE, READ_LOCAL_SOURCE } from './keys';

type FetchCall = { location: SourceLocation; settings: RemoteSourceSettings };

const calls: FetchCall[] = [];

const provideRemoteSource = (pages: Record<string, Record<string, unknown>>): void => {
  provide(FETCH_REMOTE_SOURCE, async (location: SourceLocation, settings: RemoteSourceSettings) => {
    calls.push({ location, settings });
    return pages[location.source] ?? {};
  });
};

const provideLocalSource = (files: Record<string, Record<string, unknown>>): void => {
  provide(READ_LOCAL_SOURCE, async ({ source }: SourceLocation) => files[source] ?? {});
};

describe('chargerUneSource', (): void => {
  beforeEach((): void => {
    calls.length = 0;
  });

  it('charge les enregistrements d’un fichier local', async (): Promise<void> => {
    provideLocalSource({ './assets/input/dora.json': { 0: { id: 'a' }, 1: { id: 'b' } } });

    expect(await chargerUneSource({ source: './assets/input/dora.json' })).toBe('[{"id":"a"},{"id":"b"}]');
  });

  it('ne retient que la propriété désignée par la clé', async (): Promise<void> => {
    provideLocalSource({ './assets/input/landes.json': { values: { 0: { id: 'a' } }, meta: { total: 1 } } });

    expect(await chargerUneSource({ source: './assets/input/landes.json@values' })).toBe('[{"id":"a"}]');
  });

  it('charge les enregistrements d’une source distante', async (): Promise<void> => {
    provideRemoteSource({ 'https://exemple.fr/api': { 0: { id: 'a' } } });

    expect(await chargerUneSource({ source: 'https://exemple.fr/api' })).toBe('[{"id":"a"}]');
  });

  it('suit la pagination tant que la réponse porte un lien suivant', async (): Promise<void> => {
    provideRemoteSource({
      'https://exemple.fr/api': { data: { 0: { id: 'a' } }, next: 'https://exemple.fr/api?page=2' },
      'https://exemple.fr/api?page=2': { data: { 0: { id: 'b' } } }
    });

    expect(await chargerUneSource({ source: 'https://exemple.fr/api@data' })).toBe('[{"id":"a"},{"id":"b"}]');
    expect(calls.map(({ location }: FetchCall): string => location.source)).toStrictEqual([
      'https://exemple.fr/api',
      'https://exemple.fr/api?page=2'
    ]);
  });

  /**
   * Comportement hérité, documenté plutôt que corrigé : la clé d'environnement portant le
   * jeton n'est pas transmise aux pages suivantes.
   */
  it("ne transmet pas la clé d'authentification aux pages suivantes", async (): Promise<void> => {
    provideRemoteSource({
      'https://exemple.fr/api': { data: { 0: { id: 'a' } }, next: 'https://exemple.fr/api?page=2' },
      'https://exemple.fr/api?page=2': { data: { 0: { id: 'b' } } }
    });

    await chargerUneSource({ source: 'https://exemple.fr/api@data', apiEnvKey: 'COOP_API_KEY', delimiter: ';' });

    expect(calls[0]?.settings).toStrictEqual({ apiEnvKey: 'COOP_API_KEY', delimiter: ';' });
    expect(calls[1]?.settings).toStrictEqual({ delimiter: ';' });
  });
});
