import { beforeEach, describe, expect, it } from 'vitest';
import { provide } from '../../../../libraries/injection';
import { MERGE_ERROR_MESSAGES, MergeError } from '../../domain';
import { LIST_FILES, READ_RECORDS, WRITE_RECORDS } from '../../keys';
import { fusionnerDesFichiers } from './fusionner-des-fichiers';

type WrittenFile = { filePath: string; records: unknown[] };

const written: WrittenFile[] = [];

/**
 * `inputFiles` est ce que le masque fait remonter, `storedFiles` ce que le disque contient :
 * le fichier déjà fusionné est lisible sans pour autant faire partie des entrées.
 */
const provideImplementations = (inputFiles: string[], storedFiles: Record<string, unknown[]> = {}): void => {
  provide(LIST_FILES, (): string[] => inputFiles);
  provide(
    READ_RECORDS,
    () =>
      (filePath: string): unknown[] =>
        storedFiles[filePath] ?? []
  );
  provide(WRITE_RECORDS, () => (filePath: string, records: unknown[]): void => {
    written.push({ filePath, records });
  });
};

describe('fusionnerDesFichiers', (): void => {
  beforeEach((): void => {
    written.length = 0;
  });

  it('fusionne les enregistrements de plusieurs fichiers JSON', (): void => {
    provideImplementations(['./sortie/paris.json', './sortie/lyon.json'], {
      './sortie/paris.json': [{ id: 'paris-1' }],
      './sortie/lyon.json': [{ id: 'lyon-1' }, { id: 'lyon-2' }]
    });

    const result = fusionnerDesFichiers({ inputFilesPattern: './sortie/*.json', outputDirectory: './fusion' });

    expect(result).toStrictEqual({
      format: '.json',
      mergedFilePath: 'fusion/merged_output.json',
      mergedFilesCount: 2
    });
    expect(written).toStrictEqual([
      {
        filePath: 'fusion/merged_output.json',
        records: [{ id: 'paris-1' }, { id: 'lyon-1' }, { id: 'lyon-2' }]
      }
    ]);
  });

  it('fusionne les enregistrements de plusieurs fichiers CSV', (): void => {
    provideImplementations(['./sortie/paris.csv', './sortie/lyon.csv'], {
      './sortie/paris.csv': [{ nom: 'Paris' }],
      './sortie/lyon.csv': [{ nom: 'Lyon' }]
    });

    const result = fusionnerDesFichiers({ inputFilesPattern: './sortie/*.csv', outputDirectory: './fusion' });

    expect(result.format).toBe('.csv');
    expect(result.mergedFilePath).toBe('fusion/merged_output.csv');
    expect(written[0]?.records).toStrictEqual([{ nom: 'Paris' }, { nom: 'Lyon' }]);
  });

  it('ajoute les adresses au contenu déjà fusionné plutôt que de le remplacer', (): void => {
    provideImplementations(['./sortie/paris-addresses.json'], {
      './sortie/paris-addresses.json': [{ addresseOriginale: '12 rue des Lilas' }],
      'fusion/addresses.json': [{ addresseOriginale: 'déjà connue' }]
    });

    const result = fusionnerDesFichiers({
      inputFilesPattern: './sortie/*-addresses.json',
      outputDirectory: './fusion'
    });

    expect(result.mergedFilePath).toBe('fusion/addresses.json');
    expect(written[0]?.records).toStrictEqual([
      { addresseOriginale: 'déjà connue' },
      { addresseOriginale: '12 rue des Lilas' }
    ]);
  });

  it("remonte l'erreur de domaine quand aucun fichier ne correspond au masque", (): void => {
    provideImplementations([]);

    expect((): unknown =>
      fusionnerDesFichiers({ inputFilesPattern: './introuvable/*.json', outputDirectory: './fusion' })
    ).toThrow(new MergeError(MERGE_ERROR_MESSAGES.NO_FILE_FOUND));
    expect(written).toStrictEqual([]);
  });
});
