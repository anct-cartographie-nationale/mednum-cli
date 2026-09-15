import { describe, expect, it } from 'vitest';
import { composeLoader, whenExtension, whenRemote } from './dedupliquer.loader.js';

const loading = (label: string) => (): string[] => [label];

describe('composeLoader', (): void => {
  it('confie la source à la première règle qui l’accepte', async (): Promise<void> => {
    const load = composeLoader<string>([whenExtension('.json', loading('json')), whenExtension('.csv', loading('csv'))]);

    await expect(load('./assets/lieux.csv')).resolves.toStrictEqual(['csv']);
  });

  it('reconnaît une extension à travers un motif', async (): Promise<void> => {
    const load = composeLoader<string>([whenExtension('.json', loading('json'))]);

    await expect(load('./assets/output/*/*-lieux.json')).resolves.toStrictEqual(['json']);
  });

  it('fait primer une adresse distante sur son extension', async (): Promise<void> => {
    const load = composeLoader<string>([whenRemote(loading('distant')), whenExtension('.json', loading('json'))]);

    await expect(load('https://exemple.fr/api/lieux.json')).resolves.toStrictEqual(['distant']);
  });

  it('accepte une règle asynchrone', async (): Promise<void> => {
    const load = composeLoader<string>([whenRemote(async (): Promise<string[]> => ['distant'])]);

    await expect(load('https://exemple.fr/api/lieux')).resolves.toStrictEqual(['distant']);
  });

  it('refuse une source qu’aucune règle n’accepte', async (): Promise<void> => {
    const load = composeLoader<string>([whenExtension('.json', loading('json'))]);

    await expect(load('./assets/lieux.xml')).rejects.toThrow('Format de source non pris en charge : ./assets/lieux.xml');
  });
});
