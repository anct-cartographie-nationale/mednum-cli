import { ANCIENNES_COMMUNES_MAP } from './anciennes-communes';
import { Commune } from './find-commune';

describe('anciennes communes', (): void => {
  it('should build anciennes communes map from json file', (): void => {
    const commune: Commune | undefined = ANCIENNES_COMMUNES_MAP.get('Saint-Barbant');

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
});
