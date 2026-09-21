import { describe, it, expect } from 'vitest';
import { cleDAdresse } from './annuaire-entreprises.types';
import { numeroDeVoie, voieNormalisee } from './annuaire-entreprises';

describe('numeroDeVoie', (): void => {
  it.each([
    ['8 RUE DE LA PREFECTURE', '8'],
    ['31 bis Rue Jean Gallart', '31b'],
    ['31 TER AVENUE DU GENERAL', '31t'],
    ['PLACE GEORGES DEGROOTE', ''],
    ['', '']
  ])('extrait « %s » en « %s »', (adresse, attendu): void => {
    expect(numeroDeVoie(adresse)).toBe(attendu);
  });
});

describe('voieNormalisee', (): void => {
  it.each([
    ['8 RUE DE LA PREFECTURE', 'rue de la prefecture'],
    ['12 Rue de l’Église', 'rue de l eglise'],
    ['12 Rue du Cœur Volant', 'rue du coeur volant'],
    ['12 Rue Saint-Jacques', 'rue saint jacques'],
    ['12  Rue   des Lilas', 'rue des lilas']
  ])('normalise « %s » en « %s »', (adresse, attendu): void => {
    expect(voieNormalisee(adresse)).toBe(attendu);
  });

  it('replie accents et ligatures comme le fait le lieu', (): void => {
    expect(voieNormalisee('RUE DU COEUR VOLANT')).toBe(voieNormalisee('Rue du Cœur Volant'));
    expect(voieNormalisee('RUE DE L EGLISE')).toBe(voieNormalisee("Rue de l'Église"));
  });
});

describe('cleDAdresse', (): void => {
  it('assemble code postal, commune, numéro et voie', (): void => {
    expect(cleDAdresse({ codePostal: '75002', commune: 'paris', numero: '10', voie: 'rue de la paix' })).toBe(
      '75002|paris|10|rue de la paix'
    );
  });

  it('distingue deux numéros de la même voie', (): void => {
    expect(cleDAdresse({ codePostal: '75002', commune: 'paris', numero: '10', voie: 'rue de la paix' })).not.toBe(
      cleDAdresse({ codePostal: '75002', commune: 'paris', numero: '12', voie: 'rue de la paix' })
    );
  });

  it('distingue deux communes qui partagent un code postal et un nom de voie', (): void => {
    expect(cleDAdresse({ codePostal: '30350', commune: 'savignargues', numero: '1', voie: 'place de la mairie' })).not.toBe(
      cleDAdresse({ codePostal: '30350', commune: 'cardet', numero: '1', voie: 'place de la mairie' })
    );
  });
});
