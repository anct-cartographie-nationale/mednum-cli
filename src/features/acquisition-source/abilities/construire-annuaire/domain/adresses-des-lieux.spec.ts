import { describe, it, expect } from 'vitest';
import { clesDesLieux } from './adresses-des-lieux';

describe('clés d’adresse des lieux', (): void => {
  it('assemble code postal, commune, numéro et voie normalisée', (): void => {
    expect([...clesDesLieux([{ adresse: '31 Rue Jean Gallart', code_postal: '49650', commune: 'Saint-Macaire-en-Mauges' }])]) //
      .toStrictEqual(['49650|saint macaire en mauges|31|rue jean gallart']);
  });

  it('sépare deux communes qui partagent un code postal et un nom de voie', (): void => {
    const lieux = [
      { adresse: '1 Place de la Mairie', code_postal: '30350', commune: 'Savignargues' },
      { adresse: '1 Place de la Mairie', code_postal: '30350', commune: 'Cardet' }
    ];

    expect(clesDesLieux(lieux).size).toBe(2);
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
    expect([...clesDesLieux([{ adresse: 'Place Georges Degroote', code_postal: '59190', commune: 'Hazebrouck' }])]) //
      .toStrictEqual(['59190|hazebrouck||place georges degroote']);
  });
});
