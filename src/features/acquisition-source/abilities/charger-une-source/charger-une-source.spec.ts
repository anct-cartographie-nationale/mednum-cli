import { beforeEach, describe, expect, it } from 'vitest';
import { provide } from '../../../../libraries/injection/index';
import type { RemoteSourceSettings } from '../../domain/index';
import { chargerUneSource } from './charger-une-source';
import type { SourceLocation } from './domain/index';
import { FETCH_REMOTE_SOURCE, READ_LOCAL_SOURCE } from './keys/index';

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

    expect(await chargerUneSource({ source: './assets/input/dora.json' })).toStrictEqual([{ id: 'a' }, { id: 'b' }]);
  });

  it('ne retient que la propriété désignée par la clé', async (): Promise<void> => {
    provideLocalSource({ './assets/input/landes.json': { values: { 0: { id: 'a' } }, meta: { total: 1 } } });

    expect(await chargerUneSource({ source: './assets/input/landes.json@values' })).toStrictEqual([{ id: 'a' }]);
  });

  it('charge les enregistrements d’une source distante', async (): Promise<void> => {
    provideRemoteSource({ 'https://exemple.fr/api': { 0: { id: 'a' } } });

    expect(await chargerUneSource({ source: 'https://exemple.fr/api' })).toStrictEqual([{ id: 'a' }]);
  });

  it('suit la pagination tant que la réponse porte un lien suivant', async (): Promise<void> => {
    provideRemoteSource({
      'https://exemple.fr/api': { data: { 0: { id: 'a' } }, next: 'https://exemple.fr/api?page=2' },
      'https://exemple.fr/api?page=2': { data: { 0: { id: 'b' } } }
    });

    expect(await chargerUneSource({ source: 'https://exemple.fr/api@data' })).toStrictEqual([{ id: 'a' }, { id: 'b' }]);
    expect(calls.map(({ location }: FetchCall): string => location.source)).toStrictEqual([
      'https://exemple.fr/api',
      'https://exemple.fr/api?page=2'
    ]);
  });

  it("transmet la clé d'authentification à toutes les pages", async (): Promise<void> => {
    provideRemoteSource({
      'https://exemple.fr/api': { data: { 0: { id: 'a' } }, next: 'https://exemple.fr/api?page=2' },
      'https://exemple.fr/api?page=2': { data: { 0: { id: 'b' } } }
    });

    await chargerUneSource({ source: 'https://exemple.fr/api@data', apiEnvKey: 'COOP_API_KEY', delimiter: ';' });

    expect(calls[0]?.settings).toStrictEqual({ apiEnvKey: 'COOP_API_KEY', delimiter: ';' });
    expect(calls[1]?.settings).toStrictEqual({ apiEnvKey: 'COOP_API_KEY', delimiter: ';' });
  });

  it('suit la pagination sans clé et remonte bien les enregistrements des pages suivantes', async (): Promise<void> => {
    provideRemoteSource({
      'https://exemple.fr/api': { 0: { id: 'a' }, next: 'https://exemple.fr/api?page=2' },
      'https://exemple.fr/api?page=2': { 0: { id: 'b' } }
    });

    expect(await chargerUneSource({ source: 'https://exemple.fr/api' })).toStrictEqual([{ id: 'a' }, { id: 'b' }]);
  });
});
