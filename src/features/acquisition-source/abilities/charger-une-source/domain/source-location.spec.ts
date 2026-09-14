import { describe, expect, it } from 'vitest';
import { isRemote, nextSourceLocation, sourceLocationOf } from './source-location.js';

describe('sourceLocationOf', (): void => {
  it('lit un emplacement sans clé', (): void => {
    expect(sourceLocationOf('./assets/input/dora.json')).toStrictEqual({ source: './assets/input/dora.json' });
  });

  it('sépare la clé de l’emplacement', (): void => {
    expect(sourceLocationOf('https://exemple.fr/api/elements.json@data')).toStrictEqual({
      source: 'https://exemple.fr/api/elements.json',
      key: 'data'
    });
  });

  it('accepte un emplacement vide', (): void => {
    expect(sourceLocationOf('')).toStrictEqual({ source: '' });
  });
});

describe('isRemote', (): void => {
  it('reconnaît une source distante', (): void => {
    expect(isRemote({ source: 'https://exemple.fr/api' })).toBe(true);
  });

  it('reconnaît une source locale', (): void => {
    expect(isRemote({ source: './assets/input/dora.json' })).toBe(false);
  });
});

describe('nextSourceLocation', (): void => {
  it('reprend la clé de la source pour la page suivante', (): void => {
    expect(nextSourceLocation('https://exemple.fr/api?page=2', 'data')).toStrictEqual({
      source: 'https://exemple.fr/api?page=2',
      key: 'data'
    });
  });

  it("ne fabrique pas de clé quand la source n'en a pas", (): void => {
    expect(nextSourceLocation('https://exemple.fr/api?page=2')).toStrictEqual({
      source: 'https://exemple.fr/api?page=2'
    });
  });

  it("n'interprète pas un @ présent dans l'URL de la page suivante", (): void => {
    expect(nextSourceLocation('https://exemple.fr/api?token=a@b', 'data')).toStrictEqual({
      source: 'https://exemple.fr/api?token=a@b',
      key: 'data'
    });
  });
});
