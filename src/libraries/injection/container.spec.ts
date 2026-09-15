import { describe, expect, it } from 'vitest';
import { inject, keyFor, provide, provideLazy } from './container';

type Geocode = (adresse: string) => string;

describe('container', (): void => {
  it('injecte la valeur fournie pour un contrat', (): void => {
    const VALEUR = keyFor<string>('test.valeur');

    provide(VALEUR, 'https://api.exemple.fr');

    expect(inject(VALEUR)).toBe('https://api.exemple.fr');
  });

  it('injecte la fonction fournie pour un contrat', (): void => {
    const GEOCODE = keyFor<Geocode>('test.geocode');

    provide(GEOCODE, (adresse: string): string => `geocode(${adresse})`);

    expect(inject(GEOCODE)('12 rue des Lilas')).toBe('geocode(12 rue des Lilas)');
  });

  it("ne construit l'implémentation paresseuse qu'à la première injection", (): void => {
    const PARESSEUX = keyFor<string>('test.paresseux');
    const constructions: string[] = [];

    provideLazy(PARESSEUX, (): string => {
      constructions.push('construit');
      return 'valeur';
    });

    expect(constructions).toEqual([]);
    expect(inject(PARESSEUX)).toBe('valeur');
    expect(constructions).toEqual(['construit']);
  });

  it('isole les contrats les uns des autres', (): void => {
    const PREMIER = keyFor<string>('test.isolation.premier');
    const SECOND = keyFor<string>('test.isolation.second');

    provide(PREMIER, 'premier');
    provide(SECOND, 'second');

    expect(inject(PREMIER)).toBe('premier');
    expect(inject(SECOND)).toBe('second');
  });
});
