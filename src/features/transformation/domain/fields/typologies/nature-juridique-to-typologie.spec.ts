import { Typologie } from '@gouvfr-anct/lieux-de-mediation-numerique';
import { describe, it, expect } from 'vitest';
import { typologieDeLaNatureJuridique } from './nature-juridique-to-typologie';

describe('typologie déduite de la catégorie juridique', (): void => {
  it.each([
    ['9220', Typologie.ASSO],
    ['9230', Typologie.ASSO],
    ['9260', Typologie.ASSO],
    ['9222', Typologie.AI],
    ['7210', Typologie.MUNI],
    ['7346', Typologie.CC],
    ['7348', Typologie.EPCI],
    ['7361', Typologie.CCAS]
  ])('rend %s pour la catégorie %s', (nature: string, typologie: Typologie): void => {
    expect(typologieDeLaNatureJuridique(nature)).toBe(typologie);
  });

  it.each([['5710'], ['7331'], ['1000'], ['8110'], ['']])(
    'ne rend rien pour « %s », que la catégorie juridique ne suffit pas à typer',
    (nature: string): void => {
      expect(typologieDeLaNatureJuridique(nature)).toBeUndefined();
    }
  );

  it('ne rend rien quand aucune catégorie juridique n’est connue', (): void => {
    expect(typologieDeLaNatureJuridique()).toBeUndefined();
  });
});
