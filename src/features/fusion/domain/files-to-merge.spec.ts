import { describe, expect, it } from 'vitest';
import { filesToMerge } from './files-to-merge';
import { MERGE_ERROR_MESSAGES, MergeError } from './merge.error';

describe('filesToMerge', (): void => {
  it('refuse un lot vide', (): void => {
    expect((): unknown => filesToMerge([])).toThrow(new MergeError(MERGE_ERROR_MESSAGES.NO_FILE_FOUND));
  });

  it("refuse un format qui n'est pas pris en charge", (): void => {
    expect((): unknown => filesToMerge(['./sortie/lieux.xml'])).toThrow(
      new MergeError(MERGE_ERROR_MESSAGES.UNSUPPORTED_FORMAT('.xml'))
    );
  });

  it('refuse un fichier sans extension', (): void => {
    expect((): unknown => filesToMerge(['./sortie/lieux'])).toThrow(
      new MergeError(MERGE_ERROR_MESSAGES.UNSUPPORTED_FORMAT(''))
    );
  });

  it('refuse un lot de formats mixtes', (): void => {
    expect((): unknown => filesToMerge(['./sortie/a.json', './sortie/b.csv'])).toThrow(
      new MergeError(MERGE_ERROR_MESSAGES.MIXED_FORMATS)
    );
  });

  it('accepte un lot homogène de fichiers JSON', (): void => {
    expect(filesToMerge(['./sortie/a.json', './sortie/b.json'])).toStrictEqual({
      format: '.json',
      paths: ['./sortie/a.json', './sortie/b.json']
    });
  });

  it('accepte un lot homogène de fichiers CSV', (): void => {
    expect(filesToMerge(['./sortie/a.csv'])).toStrictEqual({ format: '.csv', paths: ['./sortie/a.csv'] });
  });

  it("ignore la casse de l'extension", (): void => {
    expect(filesToMerge(['./sortie/a.JSON', './sortie/b.json'])).toStrictEqual({
      format: '.json',
      paths: ['./sortie/a.JSON', './sortie/b.json']
    });
  });
});
