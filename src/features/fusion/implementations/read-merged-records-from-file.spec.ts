import { describe, expect, it } from 'vitest';
import { readJsonRecordsFromFile } from './read-json-records-from-file';
import { readMergedRecordsFromFile } from './read-merged-records-from-file';

describe('readMergedRecordsFromFile', (): void => {
  it('rend un cumul vide quand le fichier fusionné n’existe pas encore', (): void => {
    expect(readMergedRecordsFromFile('./aucun-cumul-a-cet-endroit.json')).toStrictEqual([]);
  });

  it('laisse un fichier d’entrée manquant rester une erreur, contrairement au cumul', (): void => {
    expect((): unknown[] => readJsonRecordsFromFile('./aucune-entree-a-cet-endroit.json')).toThrow();
  });
});
