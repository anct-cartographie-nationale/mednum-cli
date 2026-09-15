import { describe, expect, it } from 'vitest';
import { followPages, type Page, type ReadPage } from './pagination';

type Curseur = { page: number };

const pagesDe = (contenu: Record<number, { records: unknown[]; suivante?: number }>): ReadPage<Curseur> => {
  return async ({ page }: Curseur): Promise<Page<Curseur>> => {
    const lue = contenu[page];
    if (lue == null) throw new Error(`page ${page} inattendue`);
    return { records: lue.records, next: lue.suivante == null ? undefined : { page: lue.suivante } };
  };
};

describe('followPages', (): void => {
  it('rend les enregistrements d’une page unique', async (): Promise<void> => {
    const lire = pagesDe({ 1: { records: ['a', 'b'] } });

    await expect(followPages({ page: 1 }, lire)).resolves.toStrictEqual(['a', 'b']);
  });

  it('accumule les pages dans l’ordre tant qu’il en reste', async (): Promise<void> => {
    const lire = pagesDe({ 1: { records: ['a'], suivante: 2 }, 2: { records: ['b'], suivante: 3 }, 3: { records: ['c'] } });

    await expect(followPages({ page: 1 }, lire)).resolves.toStrictEqual(['a', 'b', 'c']);
  });

  it('ne lit rien sans curseur de départ', async (): Promise<void> => {
    const lues: number[] = [];
    const lire: ReadPage<Curseur> = async ({ page }: Curseur): Promise<Page<Curseur>> => {
      lues.push(page);
      return { records: [], next: undefined };
    };

    await expect(followPages(undefined, lire)).resolves.toStrictEqual([]);
    expect(lues).toStrictEqual([]);
  });

  it('traverse une page vide sans s’arrêter', async (): Promise<void> => {
    const lire = pagesDe({ 1: { records: [], suivante: 2 }, 2: { records: ['b'] } });

    await expect(followPages({ page: 1 }, lire)).resolves.toStrictEqual(['b']);
  });

  it('laisse remonter l’échec d’une page', async (): Promise<void> => {
    const lire = pagesDe({ 1: { records: ['a'], suivante: 9 } });

    await expect(followPages({ page: 1 }, lire)).rejects.toThrow('page 9 inattendue');
  });
});
