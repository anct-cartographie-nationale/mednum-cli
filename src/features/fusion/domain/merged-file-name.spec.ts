import { describe, expect, it } from 'vitest';
import { appendsToMergedFile, mergedFileName } from './merged-file-name.js';

describe('mergedFileName', (): void => {
  it('nomme la fusion de fichiers CSV', (): void => {
    expect(mergedFileName({ format: '.csv', paths: ['./sortie/paris.csv'] })).toBe('merged_output.csv');
  });

  it('nomme la fusion de fichiers JSON', (): void => {
    expect(mergedFileName({ format: '.json', paths: ['./sortie/paris-sans-doublons.json'] })).toBe('merged_output.json');
  });

  it("nomme la fusion des fichiers d'adresses", (): void => {
    expect(mergedFileName({ format: '.json', paths: ['./sortie/paris-addresses.json'] })).toBe('addresses.json');
  });
});

describe('appendsToMergedFile', (): void => {
  it("cumule le contenu existant pour les fichiers d'adresses", (): void => {
    expect(appendsToMergedFile({ format: '.json', paths: ['./sortie/paris-addresses.json'] })).toBe(true);
  });

  it('remplace le contenu existant pour toute autre fusion JSON', (): void => {
    expect(appendsToMergedFile({ format: '.json', paths: ['./sortie/paris.json'] })).toBe(false);
  });

  it('remplace le contenu existant pour une fusion CSV', (): void => {
    expect(appendsToMergedFile({ format: '.csv', paths: ['./sortie/paris-addresses.csv'] })).toBe(false);
  });
});
