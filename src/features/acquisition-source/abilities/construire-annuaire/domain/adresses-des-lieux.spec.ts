import { describe, it, expect } from 'vitest';
import { clesDesLieux } from './adresses-des-lieux';

describe('clés d’adresse des lieux', (): void => {
  it('assemble code postal, numéro et voie normalisée', (): void => {
    expect([...clesDesLieux([{ adresse: '31 Rue Jean Gallart', code_postal: '49650' }])]).toStrictEqual([
      '49650|31|rue jean gallart'
    ]);
  });

  it('déduplique les lieux qui partagent une adresse', (): void => {
    const lieux = [
      { adresse: '31 Rue Jean Gallart', code_postal: '49650' },
      { adresse: '31 rue jean-gallart', code_postal: '49650' }
    ];

    expect(clesDesLieux(lieux).size).toBe(1);
  });

  it('écarte un lieu sans code postal, qu’aucun établissement ne pourrait situer', (): void => {
    expect(clesDesLieux([{ adresse: '31 Rue Jean Gallart' }]).size).toBe(0);
  });

  it('retient une adresse sans numéro, que l’annuaire peut aussi porter sans numéro', (): void => {
    expect([...clesDesLieux([{ adresse: 'Place Georges Degroote', code_postal: '59190' }])]).toStrictEqual([
      '59190||place georges degroote'
    ]);
  });
});
