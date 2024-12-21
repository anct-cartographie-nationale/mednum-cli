import { describe, it, expect } from 'vitest';
import { getNewCommune } from './anciennes-communes';
import { Commune } from './find-commune';

describe('anciennes communes', (): void => {
  it('should build anciennes communes map from json file', (): void => {
    const commune: Commune | undefined = getNewCommune('Saint-Barbant');

    expect(commune).toStrictEqual({
      nom: "Val-d'Oire-et-Gartempe",
      code: '87028',
      codeDepartement: '87',
      siren: '200083657',
      codeEpci: '200071942',
      codeRegion: '75',
      codesPostaux: ['87330']
    });
  });

  it('should build anciennes communes map from json file with uppercase', (): void => {
    const commune: Commune | undefined = getNewCommune('PLAN-DU-VAR');

    expect(commune).toStrictEqual({
      nom: 'Levens',
      code: '06075',
      codeDepartement: '06',
      siren: '2106007552',
      codeEpci: '200030195',
      codeRegion: '93',
      codesPostaux: ['06670']
    });
  });
});
