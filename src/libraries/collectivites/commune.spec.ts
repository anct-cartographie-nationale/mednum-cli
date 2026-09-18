import { describe, it, expect } from 'vitest';
import { codeCommuneDe } from './commune';

describe('codeCommuneDe', (): void => {
  it.each([
    ['75101', '75056'],
    ['75113', '75056'],
    ['75120', '75056'],
    ['69381', '69123'],
    ['69388', '69123'],
    ['69389', '69123'],
    ['13201', '13055'],
    ['13214', '13055'],
    ['13216', '13055']
  ])('ramène l’arrondissement %s à sa commune %s', (arrondissement, commune): void => {
    expect(codeCommuneDe(arrondissement)).toBe(commune);
  });

  it.each([['75056'], ['69123'], ['13055'], ['01080'], ['85047'], ['97400']])(
    'laisse %s intact, qui est déjà un code de commune',
    (codeInsee): void => {
      expect(codeCommuneDe(codeInsee)).toBe(codeInsee);
    }
  );

  it.each([['75100'], ['75121'], ['69380'], ['69390'], ['13200'], ['13217']])(
    'laisse %s intact, qui borde une plage d’arrondissements sans y appartenir',
    (codeInsee): void => {
      expect(codeCommuneDe(codeInsee)).toBe(codeInsee);
    }
  );

  it('laisse intact un code INSEE de Corse, que Number ne sait pas lire', (): void => {
    expect(codeCommuneDe('2A004')).toBe('2A004');
  });
});
