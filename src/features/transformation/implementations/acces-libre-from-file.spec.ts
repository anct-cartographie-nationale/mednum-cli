import { describe, it, expect } from 'vitest';
import { accesLibreFromFile } from './acces-libre-from-file';

describe('lecture de l’export Accès Libre', (): void => {
  it('rend un index vide quand aucun chemin n’est fourni', async (): Promise<void> => {
    expect((await accesLibreFromFile()()).size).toBe(0);
  });

  it('rend un index vide quand le fichier n’existe pas, sans tenter de le télécharger', async (): Promise<void> => {
    const debut = Date.now();

    expect((await accesLibreFromFile('./assets/input/export-absent.csv')()).size).toBe(0);
    expect(Date.now() - debut).toBeLessThan(1000);
  });
});
